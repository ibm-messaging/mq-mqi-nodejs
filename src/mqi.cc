/*
  Copyright (c) IBM Corporation 2023

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.

  Contributors:
    Mark Taylor   - Initial Contribution
*/

/************************************************************************/
/* Description:                                                         */
/* This is the main module for the N-API portion of the MQI interface   */
/* It contains the Initialisation function and related config/load      */
/* routines. There are also various utilities and debug functions       */
/************************************************************************/

#include "mqi.h"

#if defined(WIN32)
#define WIN32_LEAN_AND_MEAN
#include <windows.h>
#include <time.h>
#include <win_dlfcn.h>
#else
#include <dlfcn.h>
#include <sys/time.h>
#endif
#include <errno.h>

Configuration config = Configuration();

static const char *mqiFunctions[] = {"MQCONNX", "MQDISC",  "MQOPEN",  "MQCLOSE", "MQPUT1",  "MQPUT",   "MQGET",  "MQINQ",
                                     "MQSET",   "MQBEGIN", "MQCMIT",  "MQBACK",  "MQSTAT",  "MQCB",    "MQCTL",  "MQCALLBACK",
                                     "MQSUB",   "MQSUBRQ", "MQCRTMH", "MQDLTMH", "MQSETMP", "MQDLTMP", "MQINQMP"};
std::map<std::string, void *> mqiFnMap = {};

void mqFree(void *p) {
  if (p)
    free(p);
}

void mqFreeString(void *p) {
  if (p) {
    memset(p, 0, strlen((char *)p));
    free(p);
  }
}

// Create and throw the only inbuilt exception types in the N-API library
void throwTE(Env env, std::string s1, std::string s2) { TypeError::New(env, s1 + ": " + s2).ThrowAsJavaScriptException(); }
void throwRE(Env env, std::string s1, std::string s2) { RangeError::New(env, s1 + ": " + s2).ThrowAsJavaScriptException(); }
/* And a generic NAPI error */
void throwError(Env env, std::string s1) { Napi::Error::New(env, s1).ThrowAsJavaScriptException(); }

// Collect some global configuration for this process
void Configure(const CallbackInfo &info) {
  Object cf = info[0].As<Object>();
  config.logLevel = cf.Get("logLevel").As<Number>();
  config.platform = cf.Get("platform").As<String>();
  config.arch = cf.Get("arch").As<String>();
  config.littleEndian = cf.Get("littleEndian").As<Boolean>();
   
  Function noopFn = info[0].As<Object>().Get("noopFn").As<Function>();
  config.noopFnRef = Persistent(noopFn);
  config.noopFnRef.SuppressDestruct();

  debugf(LOG_TRACE, "Configure has loglevel %d", config.logLevel);
  //printf("LogLevel=%d\n", config.logLevel);

  return;
}

Object UNSUPPORTED_FUNCTION(const CallbackInfo &info) {
  Env env = info.Env();
  Object result = Object::New(env);
  result.Set("jsCc", Number::New(env, MQCC_FAILED));
  result.Set("jsRc", Number::New(env, MQRC_ENVIRONMENT_ERROR));
  return result;
}

/************************************************************************/
/* Function: LoadLib                                                    */
/* Description:                                                         */
/* Load the MQI library using dlopen. If successful, store pointers     */
/* to the MQI functions.Using dlopen means we don't need to have        */
/* an MQI client library during `npm install` - a postinstall script    */
/* can pull it in for later runtime use.                                */
/*                                                                      */
/* Note that we don't dlclose the module, so it remains available for   */
/* the process runtime.                                                 */
/************************************************************************/
Object LoadLib(const CallbackInfo &info) {
  Env env = info.Env();
  Object err;

  char suffixDll[] = ".dll";
  char suffixA[] = ".a";
  char suffixSo[] = ".so";
  char slashF[] = "/";
  char slashB[] = "\\";

  char *suffix;
  char *sep = slashF;

  char fullName[1024] = {0};
  char *lib = NULL;
  char *dir = NULL;

  // Base library name is 2nd parameter (eg "libmqm_r").
  // Directory to try is 1st parameter and might be NULL.
  lib = strdup(info[1].As<String>().Utf8Value().c_str());

  if (config.platform == "aix") {
    suffix = suffixA;
  } else if (config.platform == "win32") {
    suffix = suffixDll;
    sep = slashB;
  } else {
    suffix = suffixSo;
  }

  if (!info[0].IsNull() && !info[0].IsUndefined()) {
    strncpy(fullName, info[0].As<String>().Utf8Value().c_str(), sizeof(fullName) - 1);
    dir = strdup(fullName); // For debug
    strncat(fullName, sep, sizeof(fullName) - 1);
  } else {
    strncpy(fullName, "", sizeof(fullName) - 1);
  }
  strncat(fullName, lib, sizeof(fullName) - 1);
  strncat(fullName, suffix, sizeof(fullName) - 1);

  int flags = RTLD_GLOBAL | RTLD_NOW;

#ifdef _AIX
  /* The AIX shared library packaging used by MQ is different than Linux */
  /* You have to dlopen("libmqm_r.a(libmqm_r.o)") to refer to the shared */
  /* object that is in the archive library. We'll hardcode the object    */
  /* name in here as this function is only used for a single library.    */
  strncat(fullName, "(libmqm_r.o)", sizeof(fullName) - 1);
  flags |= RTLD_MEMBER;
#endif

  void *handle = dlopen(fullName, flags);

  if (!handle) {
    err = Object::New(env);
    err.Set("msg", String::New(env, dlerror()));
    debugf(LOG_DEBUG, "MQ library '%s' failed to be loaded from %s. Error: %s", lib, (dir == NULL) ? "<<default path>>" : dir,
           err.Get("msg").As<String>().Utf8Value().c_str());
  } else {
    for (const char *verb : mqiFunctions) {
      void *p = dlsym(handle, verb);
      if (p)
        mqiFnMap[verb] = p;
      else
        mqiFnMap[verb] = (void *)UNSUPPORTED_FUNCTION;
    }

    if (config.platform == "darwin") {
      // MacOS has an awful feature where default paths are added to the dynamic load EVEN IF you give
      // an explicitly-pathed filename. And you can't easily tell where it came from. So we give a slightly
      // different debug message.
      char *ldPath = getenv("DYLD_LIBRARY_PATH");
      debugf(LOG_DEBUG, "MQ library '%s' loaded from %s combined with [%s]", lib, (dir == NULL) ? "<<default path>>" : dir,
             (ldPath == NULL) ? "<<empty DYLD path>>" : ldPath);
    } else {
      debugf(LOG_DEBUG, "MQ library '%s' loaded from %s", lib, (dir == NULL) ? "<<default path>>" : dir);
    }
  }

  mqFree(lib);
  mqFree(dir);

  return err;
}

void setMQIString(Env env, char *out, Object in, const char *field, size_t len) {
  //dumpObject(env, field, in);
  if (in.IsNull() || in.IsUndefined()) {
    memset(out, ' ', len);
  } else if (in.Get(field).IsNull() || in.Get(field).IsUndefined()) {
    memset(out, ' ', len);
  } else {
    Value v = in.Get(field);
    if (v.IsString()) {
    String s = v.As<String>();
    if (s.Utf8Value().length() > len) {
      throwRE(env, "Input string too long for MQI field", field);
    } else {
      strncpy(out, s.Utf8Value().c_str(), len);
    }
    } else {
      // Leave the original MQI field untouched
      /*  memset(out, ' ', len);*/
    }
  }
}

void setMQIBytes(Env env, unsigned char *out, Object in, const char *field, size_t len) {
  if (in.IsNull() || in.IsUndefined()) {
    memset(out, 0, len);
  } else if (in.Get(field).IsNull() || in.Get(field).IsUndefined()) {
    memset(out, 0, len);
  } else {
    // printf("Type of field is %s\n",in.Get(field));
    Buffer<unsigned char> b = in.Get(field).As<Buffer<unsigned char>>();
    if (b.Length() != len) {
      throwRE(env, "Input buffer wrong length for MQI field", field);
    } else {
      memcpy(out, b.Data(), len);
    }
  }
}

String getMQIString(Env env, PMQCHAR in, size_t len) {
  // debugf(LOG_DEBUG,"GetMQIString: input: \"%-*.*s\" %d", len, len, in, len);
  int l = len - 1;
  while ((in[l] == ' ' || in[l] == 0) && l > 0) {
    l--;
  }
  // debugf(LOg_DEBUG,"    Len of returned string = %d", l);
  String rc = String::New(env, in, l + 1);
  return rc;
}

int32_t getMQLong(Object o, const char *f) {
  return o.Get(f).As<Number>().Int32Value();
}

void getMQIBytes(Env env, unsigned char *in, Object out, const char *field, size_t len) {
  if (out.Get(field).IsNull() || out.Get(field).IsUndefined()) {
    // This should never happen - it indicates an error in the C++ layer. So print it direct
    // instead of making it an application-level exception.
    fprintf(stderr, "ERROR: getMQIBytes trying to read from empty field %s\n", field);
  } else {
    // printf("Type of field is %s\n",in.Get(field));
    Buffer<unsigned char> b = out.Get(field).As<Buffer<unsigned char>>();
    if (b.Length() != len) {
      throwRE(env, "Input buffer wrong length for MQI field", field);
    } else {
      memcpy(b.Data(), in, len);
    }
  }
}

#define MAXCHARV_LENGTH 10240
void setMQICharV(Env env, PMQCHARV v, Object in, const char *field, bool output) {
  char *p;

  v->VSPtr = NULL;
  v->VSOffset = 0;
  v->VSBufSize = 0;
  v->VSLength = 0;
  v->VSCCSID = MQCCSI_APPL;

  if (!in.IsNull() && !in.IsUndefined()) {
    if (field == NULL || in.Get(field).IsNull() || in.Get(field).IsUndefined()) {
      /* The field might start off null, but we need to allocate space for */
      /* returned data                                                     */
      if (output) {
        p = (char *)malloc(MAXCHARV_LENGTH);
        memset(p, 0, MAXCHARV_LENGTH);
        v->VSPtr = p;
        v->VSBufSize = MAXCHARV_LENGTH;
        v->VSLength = 0;
      }
    } else {
      String s = in.Get(field).As<String>();
      if (s.Utf8Value().length() > MAXCHARV_LENGTH) {
        throwRE(env, "Input string too long for MQI field", field);
      } else {
        p = strdup(s.Utf8Value().c_str());
        if (p) {
          v->VSPtr = p;
          v->VSBufSize = strlen(p); /* Don't include NULL terminator */
          v->VSLength = strlen(p);
        } else {
          throwError(env, "Out of memory in setMQICharV");
        }
      }
    }
  }
  return;
}

String getMQICharV(Env env, PMQCHARV v, bool free) {
  String str;
  if (v && v->VSLength > 0) {
    str = String::New(env, (char *)v->VSPtr, v->VSLength);
  } else {
    str = String::New(env, "");
  }

  /* Get rid of the string that would have been strdup'ed earlier */
  if (free && v->VSPtr) {
    mqFree(v->VSPtr);
  }
  return str;
}

// Print a formatted string to stderr.
// Timestamp format should be like "2023-05-01T15:28:24.875Z" to match the logger.debug
// statements in the JS layer.
// Use gmtime rather than localtime for reporting (the Z is the clue)
void debugf(int level, const char *fmt, ...) {
  if (config.logLevel >= level) {
    char buf[1024] = {0};
    char timebuf[32];
    va_list va;

    va_start(va, fmt);
    vsnprintf(buf, sizeof(buf) - 1, fmt, va);
    va_end(va);

#if defined(WIN32)
    SYSTEMTIME now;
    GetSystemTime(&now);
    sprintf(timebuf,"%4.4d-%2.2d-%2.2dT%2.2d:%2.2d:%2.2d.%3.3dZ",
        now.wYear,now.wMonth,now.wDay,
        now.wHour,now.wMinute,now.wSecond,
        now.wMilliseconds);
    fprintf(stderr, "[%s] %s : %s", "mqnpi", timebuf, buf);
#else
    struct timeval tv;
    gettimeofday(&tv, NULL);
    strftime(timebuf, sizeof(timebuf), "%Y-%m-%dT%H:%M:%S", gmtime(&tv.tv_sec));
    fprintf(stderr, "[%s] %s.%3.3dZ : %s", "mqnpi", timebuf, (int)(tv.tv_usec / 1000), buf);
#endif

    if (buf[strlen(buf) - 1] != '\n')
      fprintf(stderr, "\n");
  }
  return;
}

void debugDest(Env env, void *s) {
  debugf(LOG_OBJECT, "In destructor for type %s at %p\n", (const char *)s, s);
  if (s)
    free(s);
  return;
}

static const char *spaces = "                                                                                                      ";
static void dumpObject(Env env, const char *objectType, Object o, int offset) {

  Array names = o.GetPropertyNames();
  for (unsigned int i = 0; i < names.Length(); i++) {
    Value n = names[i];
    Value v = o.Get(n.As<String>());
    if (v.IsBuffer()) {
      unsigned char *b = v.As<Buffer<unsigned char>>().Data();
      int l = v.As<Buffer<unsigned char>>().Length();
      printf("%*.*s  %-32.32s : [ ",offset,offset,spaces,n.As<String>().Utf8Value().c_str());
      for (int j=0;j<8 && j<l;j++) {
        printf("%02X ",b[j]);
      }
      if (l > 8) {
        printf(" .... ");
      }
      printf("] (%d bytes)\n",l);
    } else if (v.IsObject()) {
      dumpObject(env, n.As<String>().Utf8Value().c_str(), v.As<Object>(), offset + 2);
    } else {
      printf("%*.*s  %-32.32s : ", offset, offset, spaces, n.As<String>().Utf8Value().c_str());
      if (v.IsNumber()) {
        printf("%d\n", v.As<Number>().Int32Value());
      } else if (v.IsString()) {
        printf("'%s'\n", v.As<String>().Utf8Value().c_str());
      } else if (v.IsBoolean()) {
        bool b = v.As<Boolean>();
        printf("%s\n", b ? "true" : "false");
      } else if (v.IsNull()) {
        printf("null\n");
      } else {
        printf("Unknown type\n");
      }
    }
  }
}

void dumpObject(Env env, const char *objectType, Object o) {
  if (config.logLevel >= LOG_OBJECT) {
    if (o.IsNull()) {
      printf("Object Dump. Type: %s is NULL\n", objectType);
      return;
    }
    printf("Object Dump. Type: %s\n", objectType);
    dumpObject(env, objectType, o, 0);
  }
}

const char *napiType(napi_valuetype t) {
  switch(t) {
  case napi_undefined: return "undefined";
  case napi_null:      return "null";
  case napi_boolean:   return "boolean";
  case napi_number:    return "number";
  case napi_string:    return "string";
  case napi_symbol:    return "symbol";
  case napi_object:    return "object";
  case napi_function:  return "function";
  case napi_external:  return "external";
  default:             return "unknown";
  }
}

// Setup the exports object with references to the various functions
// implemented in the C++ code.
Object Init(Env env, Object exports) {

  exports.Set(String::New(env, "BuildTime"), String::New(env, __TIME__));

  exports.Set(String::New(env, "Configure"), Function::New(env, Configure));
  exports.Set(String::New(env, "LoadLib"), Function::New(env, LoadLib));

  exports.Set(String::New(env, "Connx"), Function::New(env, CONNX));
  exports.Set(String::New(env, "Disc"), Function::New(env, DISC));
  exports.Set(String::New(env, "Open"), Function::New(env, OPEN));
  exports.Set(String::New(env, "Close"), Function::New(env, CLOSE));

  exports.Set(String::New(env, "Begin"), Function::New(env, BEGIN));
  exports.Set(String::New(env, "Cmit"), Function::New(env, CMIT));
  exports.Set(String::New(env, "Back"), Function::New(env, BACK));

  exports.Set(String::New(env, "Inq"), Function::New(env, INQ));
  exports.Set(String::New(env, "Set"), Function::New(env, SET));

  exports.Set(String::New(env, "Sub"), Function::New(env, SUB));
  exports.Set(String::New(env, "Subrq"), Function::New(env, SUBRQ));
  exports.Set(String::New(env, "Stat"), Function::New(env, STAT));

  exports.Set(String::New(env, "Put"), Function::New(env, PUT));
  exports.Set(String::New(env, "Put1"), Function::New(env, PUT1));
  exports.Set(String::New(env, "Get"), Function::New(env, GET));

  exports.Set(String::New(env, "CrtMh"), Function::New(env, CRTMH));
  exports.Set(String::New(env, "DltMh"), Function::New(env, DLTMH));

  exports.Set(String::New(env, "SetMp"), Function::New(env, SETMP));
  exports.Set(String::New(env, "InqMp"), Function::New(env, INQMP));
  exports.Set(String::New(env, "DltMp"), Function::New(env, DLTMP));

  return exports;
}
NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init);

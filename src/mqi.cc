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
#include <time.h>
#include <win_dlfcn.h>
#include <windows.h>
#else
#include <dlfcn.h>
#include <sys/time.h>
#endif
#include <errno.h>

#if 0
#include <mutex>
#endif

Configuration config = Configuration();
int logLevel = 0;

/* Function pointers for each verb */
static const char *mqiFunctions[] = {"MQCONNX", "MQDISC",  "MQOPEN",  "MQCLOSE", "MQPUT1",  "MQPUT",   "MQGET",  "MQINQ",
                                     "MQSET",   "MQBEGIN", "MQCMIT",  "MQBACK",  "MQSTAT",  "MQCB",    "MQCTL",  "MQCALLBACK",
                                     "MQSUB",   "MQSUBRQ", "MQCRTMH", "MQDLTMH", "MQSETMP", "MQDLTMP", "MQINQMP"};
std::map<std::string, void *> mqiFnMap = {};

static const char *hex = "0123456789ABCDEF";

// Memory allocation/free routines that do basic checks on out-of-memory and throw
// errors back to the JS environment if necessary.
void *mqnAlloc(Env env, size_t l) {
  void *p = malloc(l);
  if (!p) {
    throwError(env, "Out of memory");
  }
  return p;
}

char *mqnStrdup(Env env, const char *s) {
  char *p = strdup(s);
  if (!p) {
    throwError(env, "Out of memory");
  }
  return p;
}

void mqnFree(void *p) {
  if (p)
    free(p);
}

// A string might be "sensitive" so we do a basic overwrite of the memory
// before freeing the buffer
void mqnFreeString(void *p) {
  if (p) {
    memset(p, 0, strlen((char *)p));
    free(p);
  }
}

// Create and throw the only inbuilt exception types in the N-API library
void throwTE(Env env, std::string s1, std::string s2) { TypeError::New(env, s1 + ": " + s2).ThrowAsJavaScriptException(); }
void throwRE(Env env, std::string s1, std::string s2) { RangeError::New(env, s1 + ": " + s2).ThrowAsJavaScriptException(); }
// And a generic NAPI error
void throwError(Env env, std::string s1) { Napi::Error::New(env, s1).ThrowAsJavaScriptException(); }

// Collect some global configuration for this process
void Configure(const CallbackInfo &info) {
  // Env env = info.Env();
  Object cf = info[0].As<Object>();
  logLevel = cf.Get("logLevel").As<Number>();
  config.platform = cf.Get("platform").As<String>();
  config.arch = cf.Get("arch").As<String>();

  Function noopFn = cf.Get("noopFn").As<Function>();
  config.noopFnRef = Persistent(noopFn);
  config.noopFnRef.SuppressDestruct();

  // Make sure any debug statements get flushed immediately
  if (logLevel > 0) {
    setbuf(stderr, 0);
  }
  debugf(LOG_TRACE, "Configure has loglevel %d", logLevel);

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
/* Note that we never dlclose the module, so it remains available for   */
/* the process runtime.                                                 */
/************************************************************************/
Object LoadLib(const CallbackInfo &info) {
  Env env = info.Env();
  Object err;

  char suffixDll[] = ".dll";
  char suffixA[] = ".a";
  char suffixSo[] = ".so";
  char suffixDylib[] = ".dylib";
  char slashF[] = "/";
  char slashB[] = "\\";

  char *suffix;
  char *sep = slashF;

  char fullName[1024] = {0};
  char *lib = NULL;
  char *dir = NULL;

  // Base library name is 2nd parameter (eg "libmqm_r").
  // Directory to try is 1st parameter and might be NULL.
  lib = mqnStrdup(env, info[1].As<String>().Utf8Value().c_str());

  if (config.platform == "aix") {
    suffix = suffixA;
  } else if (config.platform == "darwin") {
    suffix = suffixDylib;
  } else if (config.platform == "win32") {
    suffix = suffixDll;
    sep = slashB;
  } else {
    suffix = suffixSo;
  }

  if (!info[0].IsNull() && !info[0].IsUndefined()) {
    strncpy(fullName, info[0].As<String>().Utf8Value().c_str(), sizeof(fullName) - 1);
    dir = mqnStrdup(env, fullName); // For debug
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
    err.Set("message", String::New(env, dlerror()));
    debugf(LOG_DEBUG, "MQ library '%s' failed to be loaded from %s. Error: %s", lib, (dir == NULL) ? "<<default path>>" : dir,
           err.Get("message").As<String>().Utf8Value().c_str());
  } else {
    for (const char *verb : mqiFunctions) {
      void *p = dlsym(handle, verb);
      if (p) {
        mqiFnMap[verb] = p;
      } else {
        // Fall back to a default function if we can't find the symbol
        mqiFnMap[verb] = (void *)UNSUPPORTED_FUNCTION;
      }
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

  mqnFree(lib);
  mqnFree(dir);

  return err;
}

void setMQIString(Env env, char *out, Object in, const char *field, size_t len) {
  // dumpObject(env, field, in);
  if (in.IsNull() || in.IsUndefined()) {
    memset(out, ' ', len);
  } else if (in.Get(field).IsNull() || in.Get(field).IsUndefined()) {
    memset(out, ' ', len);
  } else {
    Value v = in.Get(field);
    if (v.IsString()) {
      String s = v.As<String>();
      size_t l = strlen(s.Utf8Value().c_str());
      if (l > len) {
        throwRE(env, "Input string too long for MQI field.", field);
      } else {
        memset(out, ' ', len);
        memcpy(out, s.Utf8Value().c_str(), l);
      }
    } else {
      // Leave the original MQI field untouched
      /*  memset(out, ' ', len);*/
    }
  }
}

void setMQIBytes(Env env, unsigned char *out, Object in, const char *field, size_t len) {
  // printf("Type of byte field %s is %s\n",field, napiType(in.Get(field).Type()));

  if (in.IsNull() || in.IsUndefined()) {
    memset(out, 0, len);
  } else if (in.Get(field).IsNull() || in.Get(field).IsUndefined()) {
    memset(out, 0, len);
  } else {
    // printf("Type of field is %s\n",in.Get(field));
    BUC b = in.Get(field).As<BUC>();
    // printf("  .. converted to buffer of length %d\n",(int)b.Length());
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
  Value v = o.Get(f);
  if (v.IsNumber()) {
    return v.As<Number>().Int32Value();
  } else {
    // We should never get here, but if we do, it's likely because one of the copyTo/FromC functions
    // has mis-spelled an object attribute. So we need to know about that.
    fprintf(stderr, "Attempting to read non-number of type %s [%d] from field %s\n", napiType(o.Type()), o.Type(), f);
    return 0;
  }
}

void getMQIBytes(Env env, unsigned char *in, Object out, const char *field, size_t len) {
  if (out.Get(field).IsNull() || out.Get(field).IsUndefined()) {
    // This should never happen - it indicates an error in the C++ layer. So print it direct
    // instead of making it an application-level exception.
    fprintf(stderr, "ERROR: getMQIBytes trying to read from empty field %s\n", field);
  } else {
    // printf("Type of field is %s\n",in.Get(field));
    BUC b = out.Get(field).As<BUC>();
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
        p = (char *)mqnAlloc(env, MAXCHARV_LENGTH);
        memset(p, 0, MAXCHARV_LENGTH);
        v->VSPtr = p;
        v->VSBufSize = MAXCHARV_LENGTH;
        v->VSLength = 0;
      }
    } else {
      String s = in.Get(field).As<String>();
      size_t l = strlen(s.Utf8Value().c_str());
      if (l > MAXCHARV_LENGTH) {
        throwRE(env, "Input string too long for MQI field", field);
      } else {
        p = mqnStrdup(env, s.Utf8Value().c_str());
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
    mqnFree(v->VSPtr);
  }
  return str;
}

#if 0 
// We may end up needing locking around the debug printing. So we can turn on this block
std::mutex mtx;
void lock() { mtx.lock();}
void unlock() { mtx.unlock();}
#else
void lock() {}
void unlock() {}
#endif

// Print a formatted string to stderr.
// Timestamp format should be like "2023-05-01T15:28:24.875Z" to match the logger.debug
// statements in the JS layer.
// Use gmtime rather than localtime for reporting (the Z is the clue)
void debugf(int level, const char *fmt, ...) {
  if (logLevel >= level) {
    char buf[1024] = {0};
    char timebuf[32];
    va_list va;

    va_start(va, fmt);
    vsnprintf(buf, sizeof(buf) - 1, fmt, va);
    va_end(va);

    lock();

#if defined(WIN32)
    SYSTEMTIME now;
    GetSystemTime(&now);
    sprintf(timebuf, "%4.4d-%2.2d-%2.2dT%2.2d:%2.2d:%2.2d.%3.3dZ", now.wYear, now.wMonth, now.wDay, now.wHour, now.wMinute, now.wSecond, now.wMilliseconds);
    fprintf(stderr, "[%s] %s : %s", "mqnpi", timebuf, buf);
#else
    struct timeval tv;
    gettimeofday(&tv, NULL);
    strftime(timebuf, sizeof(timebuf), "%Y-%m-%dT%H:%M:%S", gmtime(&tv.tv_sec));
    fprintf(stderr, "[%s] %s.%3.3dZ : %s", "mqnpi", timebuf, (int)(tv.tv_usec / 1000), buf);
#endif

    if (buf[strlen(buf) - 1] != '\n') {
      fprintf(stderr, "\n");
    }

    unlock();
  }
  return;
}

/* Attach this function to object finalisers so we can see when they are cleaned up */
void debugDest(Env env, void *s) {
  debugf(LOG_OBJECT, "In destructor for type %s at %p\n", (const char *)s, s);
  /* The string was created via strdup so it's got a unique address for each object instance */
  if (s)
    free(s);
  return;
}

/* Dump a JS object - fields and values. Is recursive to show nested objects */
static const char *spaces = "                                                                                                      ";
static void dumpObject(Env env, const char *objectType, Object o, int offset) {
  Array names = o.GetPropertyNames();
  for (unsigned int i = 0; i < names.Length(); i++) {
    Value n = names[i];
    Value v = o.Get(n.As<String>());
    if (v.IsBuffer()) {
      unsigned char *b = v.As<BUC>().Data();
      int l = v.As<BUC>().Length();
      fprintf(stderr, "%*.*s  %-32.32s : [ ", offset, offset, spaces, n.As<String>().Utf8Value().c_str());
      for (int j = 0; j < 8 && j < l; j++) {
        fprintf(stderr, "%02X ", b[j]);
      }
      if (l > 8) {
        fprintf(stderr, " ... ");
      }
      fprintf(stderr, "] (%d bytes)\n", l);
    } else if (v.IsObject()) {
      dumpObject(env, n.As<String>().Utf8Value().c_str(), v.As<Object>(), offset + 2);
    } else {
      fprintf(stderr, "%*.*s  %-32.32s : ", offset, offset, spaces, n.As<String>().Utf8Value().c_str());
      if (v.IsNumber()) {
        fprintf(stderr, "%d\n", v.As<Number>().Int32Value());
      } else if (v.IsString()) {
        fprintf(stderr, "'%s'\n", v.As<String>().Utf8Value().c_str());
      } else if (v.IsBoolean()) {
        bool b = v.As<Boolean>();
        fprintf(stderr, "%s\n", b ? "true" : "false");
      } else if (v.IsNull()) {
        fprintf(stderr, "null\n");
      } else {
        fprintf(stderr, "Unknown type\n");
      }
    }
  }
}

void dumpObject(Env env, const char *objectType, Object o) {
  if (logLevel >= LOG_OBJECT) {
    lock();
    if (o.IsNull()) {
      printf("Object Dump. Type: %s is NULL\n", objectType);
      return;
    }
    printf("Object Dump. Type: %s\n", objectType);
    dumpObject(env, objectType, o, 0);
    unlock();
  }
}

/* A simple formatter for hex data showing chars and bytes */
void dumpHex(const char *title, void *buf, int length) {
  int i, j;
  unsigned char *p = (unsigned char *)buf;
  int rows;
  int o;
  char line[80];
  FILE *fp = stderr;

  if (logLevel < LOG_OBJECT) {
    return;
  }

  lock();

  fprintf(fp, "-- %s -- (%d bytes) --------------------\n", title, length);

  rows = (length + 15) / 16;
  for (i = 0; i < rows; i++) {

    memset(line, ' ', sizeof(line));
    o = sprintf(line, "%8.8X : ", i * 16);

    for (j = 0; j < 16 && (j + (i * 16) < length); j++) {
      line[o++] = hex[p[j] >> 4];
      line[o++] = hex[p[j] & 0x0F];
      if (j % 4 == 3)
        line[o++] = ' ';
    }

    o = 48;
    line[o++] = '|';
    for (j = 0; j < 16 && (j + (i * 16) < length); j++) {
      char c = p[j];
      if (!isalnum((int)c) && !ispunct((int)c) && (c != ' '))
        c = '.';
      line[o++] = c;
    }

    o = 65;
    line[o++] = '|';
    line[o++] = 0;

    fprintf(fp, "%s\n", line);
    p += 16;
  }
  unlock();
  return;
}

/* Useful when debugging verb parameters */
const char *napiType(napi_valuetype t) {
  switch (t) {
  case napi_undefined:
    return "undefined";
  case napi_null:
    return "null";
  case napi_boolean:
    return "boolean";
  case napi_number:
    return "number";
  case napi_string:
    return "string";
  case napi_symbol:
    return "symbol";
  case napi_object:
    return "object";
  case napi_function:
    return "function";
  case napi_external:
    return "external";
  default:
    return "unknown";
  }
}

/* 
 *Setup the exports object with references to the various functions
 * implemented in the C++ code. Most of these are the analogues to the MQI verbs
 * themselves.
 */
Object Init(Env env, Object exports) {

  exports.Set(String::New(env, "BuildTime"), String::New(env, __TIME__));

  exports.Set(String::New(env, "Configure"), Function::New(env, Configure));
  exports.Set(String::New(env, "LoadLib"), Function::New(env, LoadLib));

  // The MQI functions exported from the add-on through the JS layer
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
  exports.Set(String::New(env, "GetAsync"), Function::New(env, GETASYNC));
  exports.Set(String::New(env, "GetDone"), Function::New(env, GETDONE));

  exports.Set(String::New(env, "CrtMh"), Function::New(env, CRTMH));
  exports.Set(String::New(env, "DltMh"), Function::New(env, DLTMH));

  exports.Set(String::New(env, "SetMp"), Function::New(env, SETMP));
  exports.Set(String::New(env, "InqMp"), Function::New(env, INQMP));
  exports.Set(String::New(env, "DltMp"), Function::New(env, DLTMP));

  exports.Set(String::New(env, "_SetTuningParameters"), Function::New(env, SetTuningParameters));

  // This entrypoint is for "internal" use only, allowing test functions
  // to be compiled into the add-on without disruption
  exports.Set(String::New(env, "_TestSP"), Function::New(env, TESTSP));

  return exports;
}
NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init);

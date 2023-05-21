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

#include "mqi.h"

using namespace Napi;

class AppContext {
public:
  FunctionReference appCBRef;
  ObjectReference jsHObjRef;
  ObjectReference result;
};
std::map<std::string, AppContext *> appContextMap;

using Context = Reference<Value>;
using FinalizerDataType = void;

class ReturnedData {
public:
  MQHCONN hConn;
  MQHOBJ hObj;
  MQLONG mqcc;
  MQLONG mqrc;
  unsigned char *mqmd;
  unsigned char *mqgmo;
  unsigned char *body;
  int len;
};

std::string makeKey(MQHCONN hConn, MQHOBJ hObj);

void PreJsCB(Napi::Env env, Function callback, Context *context, ReturnedData *data);
void PostJsCB(const CallbackInfo &info);
using TSFN = TypedThreadSafeFunction<Context, ReturnedData, PreJsCB>;

void FinalizerCallback(Napi::Env env, void *finalizeData, void *context) { debugf(LOG_TRACE, "TSFN Finalizer Callback"); };
using BUC = Buffer<unsigned char>;

static TSFN tsfn;
static bool initialised = false;
enum { IDX_GETA_HCONN = 0, IDX_GETA_HOBJ, IDX_GETA_JSHOBJ, IDX_GETA_MD, IDX_GETA_GMO, IDX_GETA_JS_CALLBACK, IDX_GETA_APP_CALLBACK };
int32_t msgCount = 0;

// This is only called on the main thread so don't need locking
static void init(const CallbackInfo &info) {
  Env env = info.Env();

  if (!initialised) {
    Context *context = new Reference<Value>(Persistent(info.This()));
    tsfn = TSFN::New(env,                                       // Environment
                     info[IDX_GETA_JS_CALLBACK].As<Function>(), // JS function from caller
                     "AsyncCB",                                 // Resource name
                     0,                                         // Max queue size (0 = unlimited).
                     1,                                         // Initial thread count
                     context,                                   // Context,
                     FinalizerCallback                          // Finalizer
    );

    initialised = true;
  }
}

/*
This function is scheduled for being called on the main thread. It builds the various objects/values to be
passed back
*/
void BUCFinalize(Env env, unsigned char *p) {
  debugf(LOG_DEBUG, "In BUCFinalize for %p", p);
  if (p) {
    mqnFree(p);
  }
}

void PreJsCB(Env env, Function callback, Context *context, ReturnedData *data) {

  debugf(LOG_DEBUG, "PreJSCB - ReturnedData is passed at %p", data);
  Object o;
  if (env != nullptr) {

    if (callback != nullptr) {
      Buffer<unsigned char> b1;
      Buffer<unsigned char> b2;
      Buffer<unsigned char> b3;

      string key = makeKey(data->hConn, data->hObj);

      int mapCount = appContextMap.count(key);
      if (mapCount == 1) {
        AppContext *appContext = appContextMap[key];
        Function f = appContext->appCBRef.Value().As<Function>();
        o = appContext->result.Value();
        o.Set("appCB", f);
        o.Set("jsHObj", appContext->jsHObjRef.Value());
        o.Set("jsCc", Number::New(env, data->mqcc));
        o.Set("jsRc", Number::New(env, data->mqrc));
      } else {
        debugf(LOG_DEBUG, "Map contains %d entries for key", mapCount);
        o = Object::New(env);
        o.Set("jsCc", Number::New(env, data->mqcc));
        o.Set("jsRc", Number::New(env, data->mqrc));
      }

      if (data->mqmd) {
        b1 = BUC::New(env, data->mqmd, MQMD_LENGTH_2, BUCFinalize);
        b1.AddFinalizer(debugDest, mqnStrdup(env, "PreJsCB MQMD"));
      }
      if (data->mqgmo) {
        b2 = BUC::New(env, data->mqgmo, MQGMO_LENGTH_4, BUCFinalize);
        b2.AddFinalizer(debugDest, mqnStrdup(env, "PreJsCB MQGMO"));
      }

      if (data->body) {
        b3 = BUC::New(env, data->body, data->len, BUCFinalize);
        b3.AddFinalizer(debugDest, mqnStrdup(env, "PreJsCB BODY"));
      }

      // And now we can call a JS function - this is actually a "proxy" in 
      // the ibmmq layer that in turn calls the real application callback
      if (data->mqcc == MQCC_OK) {
        callback.Call({o, b1, b2, b3});
        debugf(LOG_DEBUG, "Called the callback with buffers.");
        // Any cleanup can be done here - can we free the Buffer contents here?
      } else {
        callback.Call({o});
        debugf(LOG_DEBUG, "Called the callback with no data.");
        // Any cleanup can be done here
      }

    } else {
      debugf(LOG_DEBUG, "Cannot find appContext for key %d/%d", data->hConn, data->hObj);
    }
  }
}

// may have several of these invoked before preJsCB gets executed
void mqnCB(MQHCONN hConn, MQMD *pmqmd, MQGMO *pmqgmo, MQBYTE *buf, MQCBC *pContext) {

  MQLONG len;
  debugf(LOG_DEBUG, "In mqnCB");

  auto retData = new ReturnedData;
  debugf(LOG_DEBUG, "mqnCB  - ReturnedData is stored at %p", retData);

  retData->hConn = hConn;
  retData->hObj = pContext->Hobj;
  retData->mqrc = pContext->Reason;
  retData->mqcc = pContext->CompCode;

  retData->mqmd = NULL;
  retData->mqgmo = NULL;
  retData->body = NULL;
  retData->len = 0;

  switch (pContext->CallType) {
  case MQCBCT_MSG_REMOVED:
  case MQCBCT_MSG_NOT_REMOVED:
    len = pmqgmo->ReturnedLength;
    // dumpHex("Async MQMD", pmqmd, MQMD_LENGTH_2);
    // dumpHex("Async Message", buf, len);
    {
      retData->mqmd = (unsigned char *)malloc(MQMD_LENGTH_2);
      memcpy(retData->mqmd, pmqmd, MQMD_LENGTH_2);
      retData->mqgmo = (unsigned char *)malloc(MQGMO_LENGTH_4);
      memcpy(retData->mqgmo, pmqgmo, MQGMO_LENGTH_4);
      retData->body = (unsigned char *)malloc(len);
      memcpy(retData->body, buf, len);
      retData->len = len;
    }
    break;
  case MQCBCT_EVENT_CALL:
    if ((pContext->Reason == MQRC_OBJECT_CHANGED) || (pContext->Reason == MQRC_CONNECTION_BROKEN) || (pContext->Reason == MQRC_Q_MGR_STOPPING) ||
        (pContext->Reason == MQRC_Q_MGR_QUIESCING) || (pContext->Reason == MQRC_CONNECTION_QUIESCING) || (pContext->Reason == MQRC_CONNECTION_STOPPING) ||
        (pContext->Reason == MQRC_NO_MSG_AVAILABLE)) {
      // construct error object to pass to appCB
      debugf(LOG_DEBUG, "Need to send error %d for calltype %d to app ****", pContext->Reason, pContext->CallType);
    }
    break;
  default:
    debugf(LOG_DEBUG, "**** Unexpected CallType = %d ****", pContext->CallType);
    break;
  }

  napi_status status = tsfn.NonBlockingCall(retData);

  if (status != napi_ok) {
    Napi::Error::Fatal("ThreadEntry", "Napi::ThreadSafeNapi::Function.NonBlockingCall() failed");
  }

  return;
}

std::string makeKey(MQHCONN hConn, MQHOBJ hObj) {
  string s = std::to_string(hConn) + "/" + std::to_string(hObj);
  debugf(LOG_DEBUG, "MakeKey: %s mapCount: %d", s.c_str(), appContextMap.count(s));
  return s;
}

// Get rid of the listener for this object, and remove it from any local context
void cleanupObjectContext(MQHCONN hConn, MQHOBJ hObj, PMQLONG pCC, PMQLONG pRC) {

  MQCTLO mqctlo = {MQCTLO_DEFAULT};

  debugf(LOG_DEBUG, "CleanupContext for key %d/%d", hConn, hObj);

  CALLMQI("MQCTL", MQHCONN, MQLONG, PMQCTLO, PMQLONG, PMQLONG)
  (hConn, MQOP_SUSPEND, &mqctlo, pCC, pRC);

  if (*pCC == MQCC_OK) {

    CALLMQI("MQCB", MQHCONN, MQLONG, PMQCBD, MQHOBJ, PMQMD, PMQGMO, PMQLONG, PMQLONG)
    (hConn, MQOP_DEREGISTER, NULL, hObj, NULL, NULL, pCC, pRC);

    if (*pCC == MQCC_OK) {
      CALLMQI("MQCTL", MQHCONN, MQLONG, PMQCTLO, PMQLONG, PMQLONG)
      (hConn, MQOP_RESUME, &mqctlo, pCC, pRC);
    }
  }
  // Always clean up the maps, even if the MQCB failed - it is most likely
  // because the hObj has already been removed.
  string key = makeKey(hConn, hObj);
  if (appContextMap.count(key) == 1) {
    AppContext *appContext = appContextMap[key];
    delete (appContext);
    appContextMap.erase(key);
  }

  // any more needed to remove s and appContext?
}

// Get rid of the listener for this object, and remove it from any local context
void cleanupConnectionContext(MQHCONN hConn) {

  debugf(LOG_DEBUG, "CleanupContext for key %d/-", hConn);

  // Don't need to call MQCB, just remove all object contexts for this hConn
  string key = makeKey(hConn, -999);
  // TODO:
  // iterate through appContextMap
  //   if key matches, do the deletes
  // any more needed to remove s and appContext?
}

#define VERB "GETASYNC"
Object GETASYNC(const CallbackInfo &info) {

  MQHCONN hConn = MQHC_UNUSABLE_HCONN;
  MQHOBJ hObj = MQHO_UNUSABLE_HOBJ;

  Object jsmd;
  MQMD mqmd = {MQMD_DEFAULT};
  PMQMD pmqmd = NULL;

  Object jsgmo;
  MQGMO mqgmo = {MQGMO_DEFAULT};
  PMQGMO pmqgmo = NULL;

  MQCBD mqcbd = {MQCBD_DEFAULT};
  MQCTLO mqctlo = {MQCTLO_DEFAULT};

  MQLONG CC = -1;
  MQLONG RC = -1;

  Env env = info.Env();

  init(info);

  Function appCB; /* This is the callback as specified in the application */

  Object result = Object::New(env);
  if (logLevel >= LOG_OBJECT) {
    result.AddFinalizer(debugDest, mqnStrdup(env, VERB));
  }

  if (info.Length() != IDX_GETA_APP_CALLBACK + 1) {
    throwTE(env, VERB, "Wrong number of arguments");
  }

  hConn = info[IDX_GETA_HCONN].As<Number>().Int32Value();
  hObj = info[IDX_GETA_HOBJ].As<Number>().Int32Value();

  Value v = info[IDX_GETA_MD];
  if (v.IsBuffer()) {
    pmqmd = (PMQMD)v.As<Buffer<unsigned char>>().Data();
  } else {
    jsmd = info[IDX_GETA_MD].As<Object>();
    pmqmd = &mqmd;
    copyMDtoC(env, jsmd, pmqmd);
  }

  v = info[IDX_GETA_GMO];
  if (v.IsBuffer()) {
    pmqgmo = (PMQGMO)v.As<Buffer<unsigned char>>().Data();
  } else {
    jsgmo = info[IDX_GETA_GMO].As<Object>();
    pmqgmo = &mqgmo;
    copyGMOtoC(env, jsgmo, pmqgmo);
  }

  v = info[IDX_GETA_APP_CALLBACK];
  AppContext *appContext = new AppContext;
  appContext->appCBRef = Persistent(v.As<Function>());
  Object jsHObj = info[IDX_GETA_JSHOBJ].As<Object>();
  appContext->jsHObjRef = Persistent(jsHObj);
  appContext->result = Persistent(Object::New(env));

  appContextMap[makeKey(hConn, hObj)] = appContext;

  mqcbd.CallbackFunction = (MQPTR)mqnCB;
  mqcbd.Options |= MQCBDO_FAIL_IF_QUIESCING;
  mqcbd.CallbackArea = appContext;

  CALLMQI("MQCB", MQHCONN, MQLONG, PMQCBD, MQHOBJ, PMQMD, PMQGMO, PMQLONG, PMQLONG)
  (hConn, MQOP_REGISTER, &mqcbd, hObj, pmqmd, pmqgmo, &CC, &RC);

  if (CC == MQCC_OK) {
    CALLMQI("MQCTL", MQHCONN, MQLONG, PMQCTLO, PMQLONG, PMQLONG)
    (hConn, MQOP_START, &mqctlo, &CC, &RC);
  }

  result.Set("jsCc", Number::New(env, CC));
  result.Set("jsRc", Number::New(env, RC));

  return result;
}
#undef VERB

#define VERB "GETDONE"
Object GETDONE(const CallbackInfo &info) {
  enum { IDX_GETDONE_HCONN = 0, IDX_GETDONE_HOBJ };

  Env env = info.Env();

  if (info.Length() != IDX_GETDONE_HOBJ + 1) {
    throwTE(env, VERB, "Wrong number of arguments");
  }

  MQHCONN hConn = info[IDX_GETDONE_HCONN].As<Number>().Int32Value();
  MQHOBJ hObj = info[IDX_GETDONE_HOBJ].As<Number>().Int32Value();

  MQLONG CC = -1;
  MQLONG RC = -1;

  Object result = Object::New(env);
  cleanupObjectContext(hConn, hObj, &CC, &RC);

  result.Set("jsCc", Number::New(env, CC));
  result.Set("jsRc", Number::New(env, RC));

  return result;
}

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


/*
  This module implements the asynchronous consume model using MQ's
  callback feature. MQ will deliver messages or events through a thread
  it creates when the MQCB/MQCTL verbs run. The callback function that
  we tell MQ about will be executing on that thread. Which cannot directly call
  JS callback functions. Those can only be invoked from the main thread. So we use
  a N-API TypedThreadSafeFunction to schedule the callback. We cannot use the
  BlockingCall method that could pause returning from the C callback - that leads
  to potential deadlock if other MQ verbs are being called at the same time. Instead
  we use NonBlockingCall to queue the work of invoking the JS callback.

  The C callback returns immediately to the qmgr after setting up the TSFN work. In order
  pass control structures and message data to the application, we take copies (malloc/memcpy).
  Which is a bit inefficient but is necessary. Those structures are held in stack memory in the calling
  process so disappear after return from the C callback. So a local structure is allocated pointing to
  those copies and other required fields.

  When the TSFN runs, it is given that structure and can then combine that with information in the ObjContext
  map to work out which JS function to call. Which it will do synchronously. The flow then goes
      TSFN->JS proxy in mqigeta.js -> Application callback
  After that chain unwinds, we can free malloced memory. The associated Buffer objects will be garbage collected
  at some future point. The application cannot rely on the buffer contents (MQMD, MQGMO, message body) after it
  returns from its own callback.

  Any changes that the application attempts to the structures are not sent back into the qmgr. So you can't change,
  for example, the GMO.Options value. This is not a restriction specific to this NodeJS layer; it is true for all MQI
  application environments.

  Callback Tuning Options:
  -----------------------
  There are two high-level tuning parameter options to affect how callbacks are managed.

  The first is callbackStrategy.

  There are a number of possible strategies to ensure some degree of "fairness" between queueing work from the MQ callback
  and having the application JS code run. We would rather not have the queued work be too far ahead of the application
  seeing the message data, but there's no single solution I've found to having it run in a timely way.

  The CB_SYNCED callbackStrategy setting for this code uses temporary suspend/resume operations to only
  have a single outstanding application callback per hConn. When connecting as a client, the MQCTL operations are still
  handled locally, so are not network-performance sensitive.

  The CB_READAHEAD strategy allows the queued work to get a long way ahead of the delivery of messages from the queue manager.
  There are some mutexed areas active/commented out as ways of blocking the MQ callback thread temporarily. Some aspects
  of that behaviour can be affected by tuningParamters. This strategy might perform better for some workloads.

  But for regular message arrival/consumption patterns, the READAHEAD seems to work as long as the
  application callback does not spend too much time processing the message. I've chosen to have the async worker queue for the TSFN
  be unlimited length by default.

  The second tuningParameter is a boolean called "useCtl".

  For most applications, the default value (false) of this parameter will be fine. But if you are setting up a number of
  consumer callbacks, you might not want to kick any of them off until all the callbacks are in place. With the useCtl value
  set to true, applications can call ibmmq.Get() many times before any messages will be delivered. Once all the callbacks are
  ready, then use Ctl(MQOP_START) to begin processing of inbound messages. This new Ctl() verb is the analogue of MQCTL. It
  supports the 3 relevant operations - MQOP_START, MQOP_SUSPEND and MQOP_RESUME. Stopping of consumers is handled during
  application exit or when all object handles are closed.

  Also note that the MQ thread management has a separate callback thread for each hConn, hence the need to possible handle both an hConn and a process-wide
  mutex model.

 */

#include "mqi.h"

#include <chrono>
#include <mutex>
#include <thread>

class ObjContext {
public:
  FunctionReference appCBRef;
  ObjectReference jsHObjRef;
  ObjectReference result;
  int queuedCount = 0;
};

class ConnContext {
public:
  mutex mtx;
  int queuedCount = 0;
};

static map<string, ObjContext *> objContextMap;
static map<MQLONG, ConnContext *> connContextMap;

#define HOBJ_WILDCARD (-2)

/* This is what gets passed from the callback registered with MQ to the PreJsCB function. */
class ReturnedData {
public:
  MQHCONN hConn;
  MQHOBJ hObj;
  MQLONG mqcc;
  MQLONG mqrc;
  MQLONG callType;
  unsigned char *buf;
  int bodyLen;
};

using Context = void; // Not going to use any
void PreJsCB(Env env, Function callback, Context *context, ReturnedData *data);

/* Make it simpler to type the types */
using TSFN = TypedThreadSafeFunction<Context, ReturnedData, PreJsCB>;
void FinalizerCallback(Env env, void *finalizeData, Context *context) { debugf(LOG_TRACE, "TSFN Finalizer Callback"); };

string makeKey(MQHCONN hConn, MQHOBJ hObj);

static TSFN tsfn;
static bool initialised = false;
static mutex processMtx;

enum CB_STRATEGY { CB_SYNCED, CB_READAHEAD };
CB_STRATEGY callbackStrategy = CB_SYNCED;

enum {
  IDX_GETA_HCONN = 0,
  IDX_GETA_HOBJ,
  IDX_GETA_JSHOBJ,
  IDX_GETA_MD,
  IDX_GETA_GMO,
  IDX_GETA_USECTL,
  IDX_GETA_JS_CALLBACK,
  IDX_GETA_APP_CALLBACK,
  IDX_LAST
};

// This is only called on the main thread so doesn't need locking
static void initTsfn(const CallbackInfo &info) {
  Env env = info.Env();

  if (!initialised) {
    tsfn = TSFN::New(env,                                       // Environment
                     info[IDX_GETA_JS_CALLBACK].As<Function>(), // JS function from caller - the amqsgeta.js callback proxy, not the application's
                     "PreJsCB",                                 // Resource name
                     0,                                         // Max queue size (0 = unlimited).
                     1,                                         // Initial thread count
                     nullptr,                                   // Context,
                     FinalizerCallback);
    initialised = true;
  }
}

void BUCFinalize(Env env, unsigned char *p) {
  debugf(LOG_OBJECT, "In BUCFinalize for %p", p);
  if (p) {
    mqnFree(p);
  }
}

/*
This function is scheduled for being called on the main thread. It builds the various objects/values to be
passed back into a single buffer. This function has to match with mqnCB below, and preJsAppCB in mqigeta.js,
so that the buffer is parsed correctly (GMO, MD, body).
*/
void PreJsCB(Env env, Function callback, Context *context, ReturnedData *data) {
  bool foundCb = false;

  debugf(LOG_TRACE, "In PreJsCB");

  Object o;
  if (env != nullptr) {
    if (callback != nullptr) {
      BUC b;

      string key = makeKey(data->hConn, data->hObj);

      int mapCount = objContextMap.count(key);
      if (mapCount == 1) {
        ObjContext *objContext = objContextMap[key];
        Function f = objContext->appCBRef.Value().As<Function>();

        o = objContext->result.Value();
        o.Set("appCB", f);
        o.Set("jsHObj", objContext->jsHObjRef.Value());
        o.Set("jsCc", Number::New(env, data->mqcc));
        o.Set("jsRc", Number::New(env, data->mqrc));
        o.Set("jsCallType", Number::New(env, data->callType));
        foundCb = true;
      } else if (data->callType == MQCBCT_EVENT_CALL) {
        // We do not register for EVENT callbacks, but the MQ Client libraries
        // create an EVENT_CALL anyway. This is confusing but accurate.
        // So if we receive one, we will fake up a response to send back to the
        // application by calling one of the registered listeners for the hConn.
        //
        // See Issue #173.

        // We search the map and try to find the first callback for this hConn.
        key = makeKey(data->hConn, HOBJ_WILDCARD);
        for (auto it = objContextMap.begin(); it != objContextMap.end(); ++it) {
          string mapKey = it->first;
          if (mapKey.find(key, 0) == 0) { // startswith()
            ObjContext *objContext = objContextMap[mapKey];
            Function f = objContext->appCBRef.Value().As<Function>();

            o = objContext->result.Value();
            o.Set("appCB", f);
            o.Set("jsHObj", objContext->jsHObjRef.Value());
            o.Set("jsCc", Number::New(env, data->mqcc));
            o.Set("jsRc", Number::New(env, data->mqrc));
            o.Set("jsCallType", Number::New(env, data->callType));
            debugf(LOG_DEBUG, "setting up the callback for event for key %s",mapKey.c_str());
            foundCb = true;
            break;
          }
        }
      }

      if (!foundCb) {
        o = Object::New(env);
        o.Set("jsCc", Number::New(env, data->mqcc));
        o.Set("jsRc", Number::New(env, data->mqrc));
        o.Set("jsCallType", Number::New(env, data->callType));
        debugf(LOG_DEBUG, "No callback object found for key %s",key.c_str());
      }

      // And now we can call a JS function - this is actually a "proxy" in
      // the ibmmq layer that in turn calls the real application callback
      if (data->mqcc == MQCC_OK) {
        b = BUC::New(env, data->buf, MQGMO_LENGTH_4 + MQMD_LENGTH_2 + data->bodyLen, BUCFinalize);
        callback.Call({o, b});
        debugf(LOG_DEBUG, "Called the callback with buffer.");
        // Any cleanup can be done here - no need to free the Buffer contents here as
        // BUCFinalize does get called at regular intervals
      } else {
        callback.Call({o});
        debugf(LOG_DEBUG, "Called the callback with no data.");
      }

    } else {
      debugf(LOG_DEBUG, "Cannot find objContext for key %d/%d", data->hConn, data->hObj);
    }
  } else {
    debugf(LOG_DEBUG, "PreJsCB - called with no env");
  }

  // Can now resume reception of messages for this hConn
  if (callbackStrategy == CB_SYNCED) {
    MQLONG CC, RC;
    MQCTLO mqctlo = {MQCTLO_DEFAULT};

    _MQCTL(data->hConn, MQOP_RESUME, &mqctlo, &CC, &RC);
    debugf(LOG_DEBUG, "PreJsCB - MQCTL RESUME hConn=%d CC=%d RC=%d", data->hConn, CC, RC);
  }

  // We don't need the returnedData structure any more */
  delete (data);
}

// May have many of these invoked before preJsCB gets executed
// There may also be invocations on various different threads. Each hConn has
// to have its own callback thread, and they might be invoked simultaneously. But for a given
// hConn, the callbacks will always be made from the MQI to the same thread.
// In any case, there is no critical use of global data here (either read or write)
// so shouldn't need any locking.
void mqnCB(MQHCONN hConn, MQMD *pmqmd, MQGMO *pmqgmo, MQBYTE *buf, MQCBC *pContext) {

  MQLONG len;
  size_t totalAlloc;
  unsigned char *p;
  debugf(LOG_TRACE, "In mqnCB");

  auto retData = new ReturnedData;

  retData->hConn = hConn;
  retData->hObj = pContext->Hobj;
  retData->mqrc = pContext->Reason;
  retData->mqcc = pContext->CompCode;
  retData->callType = pContext->CallType;

  retData->buf = NULL;
  retData->bodyLen = 0;

  switch (pContext->CallType) {
  case MQCBCT_MSG_REMOVED:
  case MQCBCT_MSG_NOT_REMOVED:
    len = pmqgmo->ReturnedLength;
    retData->bodyLen = len;

    // dumpHex("Async MQMD", pmqmd, MQMD_LENGTH_2);
    // dumpHex("Async Message", buf, len);

    // These structures passed from the queue manager are in stack storage so
    // they disappear after we return from this function. So we have to take copies of them
    // before passing to the real main-thread callback. Allocate a single block large enough
    // for all the stuff we pass.
    totalAlloc = MQGMO_LENGTH_4 + MQMD_LENGTH_2 + len;
    retData->buf = (unsigned char *)malloc(totalAlloc);
    if (retData->buf == NULL) {
      // A malloc problem is going to be fairly fatal
      Error::Fatal("mqmCB", "Out of memory error. Call to malloc returned NULL.");
    }
    memcpy(retData->buf, pmqgmo, MQGMO_LENGTH_4);
    p = retData->buf + MQGMO_LENGTH_4;
    memcpy(p, pmqmd, MQMD_LENGTH_2);

    p += MQMD_LENGTH_2;
    if (len > 0) {
      memcpy(p, buf, len);
    }

    if (pContext->Reason != MQRC_NONE) {
      debugf(LOG_DEBUG, "mqnCB - Message delivery returned error %d for calltype %d ", pContext->Reason, pContext->CallType);
    }
    break;

  case MQCBCT_EVENT_CALL:
    // Some errors are "interesting". The app should probably quit/reconnect with these errors. So we trace them
    // to help debug.
    switch (pContext->Reason) {
    case MQRC_OBJECT_CHANGED:
    case MQRC_CONNECTION_BROKEN:
    case MQRC_Q_MGR_STOPPING:
    case MQRC_Q_MGR_QUIESCING:
    case MQRC_CONNECTION_QUIESCING:
    case MQRC_CONNECTION_STOPPING:
    case MQRC_NO_MSG_AVAILABLE:
      debugf(LOG_DEBUG, "mqnCB - Error %d for hConn/hObj %d/%d", pContext->Reason, hConn, pContext->Hobj);
      break;
    default:
      // Pass it through
      break;
    }

    break;

  default:
    debugf(LOG_DEBUG, "mqnCB - Unexpected CallType: %d", pContext->CallType);
    break;
  }

  switch (callbackStrategy) {

  case CB_SYNCED:
    // For the strategy of not having any backlog of queued work, we stop any further delivery of
    // messages for this hConn until the application callback has completed. Do the suspension BEFORE
    // scheduling the callback.
    {
      MQLONG CC, RC;
      MQCTLO mqctlo = {MQCTLO_DEFAULT};

      _MQCTL(hConn, MQOP_SUSPEND, &mqctlo, &CC, &RC);
      debugf(LOG_DEBUG, "mqnCB - MQCTL SUSPEND hConn=%d CC=%d RC=%d", hConn, CC, RC);
    }
    break;

  case CB_READAHEAD:
    // This is an alternative strategy for getting the messages off the queeu as fast as possbile, but at the cost
    // of potential unreliabilty and overlapping work. Lots of callbacks can be scheduled to run "simultaneously" with
    // their own message contents.We may decide here to delay callbacks a little while to allow the
    // PreJsCB functions a chance to catch up if we think there might be too many in a queue.
    // C++ automatically creates an object if you simply use x=myMap[unknown_key].So check the key exists
    // in the map first.
    if (connContextMap.count(hConn) == 1) {
      ConnContext *connContext = connContextMap[hConn];
      if (connContext != NULL && connContext->queuedCount++ > config.maxConsecutiveGets) {
        connContext->mtx.lock();
        // Test again under the lock
        if (connContext->queuedCount++ > config.maxConsecutiveGets) {
          connContext->queuedCount = 0;
          debugf(LOG_DEBUG, "mqnCB - delaying for a while on hConn %d after %d messages: %dms", hConn, config.maxConsecutiveGets, config.getLoopDelayTimeMs);
          MQLONG CC, RC;
          MQCTLO mqctlo = {MQCTLO_DEFAULT};

          _MQCTL(hConn, MQOP_SUSPEND, &mqctlo, &CC, &RC);
          debugf(LOG_DEBUG, "mqnCB - MQCTL(1)    CC:%d RC %d", CC, RC);
          this_thread::sleep_for(chrono::milliseconds(config.getLoopDelayTimeMs));
          _MQCTL(hConn, MQOP_RESUME, &mqctlo, &CC, &RC);
          debugf(LOG_DEBUG, "mqnCB - MQCTL(2)    CC:%d RC %d", CC, RC);
        }
        connContext->mtx.unlock();
      }
    }
    break;

  default:
    debugf(LOG_DEBUG,"mqnCB - unknown callback strategy!");
    break;
  }

  bool queued = false;
  int retries = 0;

  //  processMtx.lock(); // Block all callbacks temporarily while we give the worker queue a chance to drain.

  // Now add the user's callback (actually our NodeJS proxy function) to the queue to be executed
  //
  // Try it a few times - when using CB_SYNCED, this should always work. But the readahead strategy might
  // give us a long queue - while again it should always work as the queue is defined as unlimited, we may still
  // want to careful.
  while (!queued && retries < 10) {
    napi_status status = tsfn.NonBlockingCall(retData);
    if (status == napi_ok) {
      queued = true;
    } else if (status == napi_queue_full && retries < 10) {
      /* Should never see this if queue to TSFN is unlimited */
      debugf(LOG_DEBUG, "mqnCB - delaying for a while on hConn %d as worker queue full", hConn);
      this_thread::sleep_for(chrono::milliseconds(config.getLoopDelayTimeMs));
      retries++;
    } else {
      // Something else has gone wrong - consider it fatal
      std::string errmsg = "TypedThreadSafeNapi::Function.NonBlockingCall() failed with status ";
      std::string s = std::to_string(status);
      Error::Fatal("mqmCB", (errmsg + s).c_str());
    }
  }

  // processMtx.unlock();

  return;
}
/***************************************************************************************************************
 *
 * This is the main entrypoint for the application to set up an async message consumer. This verb itself always
 * runs synchronously on the JS main thread, but sets up the callbacks for the given hObj.
 */
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
  bool useCtl;

  MQLONG CC = -1;
  MQLONG RC = -1;

  Env env = info.Env();

  initTsfn(info);

  Function appCB; /* This is the callback as specified in the application */

  Object result = Object::New(env);
  if (logLevel >= LOG_OBJECT) {
    result.AddFinalizer(debugDest, mqnStrdup(env, VERB));
  }

  if (info.Length() != IDX_LAST) {
    throwTE(env, VERB, "Wrong number of arguments");
  }

  hConn = info[IDX_GETA_HCONN].As<Number>().Int32Value();
  hObj = info[IDX_GETA_HOBJ].As<Number>().Int32Value();
  useCtl = info[IDX_GETA_USECTL].As<Boolean>();
  Value v = info[IDX_GETA_MD];
  if (v.IsBuffer()) {
    pmqmd = (PMQMD)v.As<BUC>().Data();
  } else {
    jsmd = info[IDX_GETA_MD].As<Object>();
    pmqmd = &mqmd;
    copyMDtoC(env, jsmd, pmqmd);
  }

  v = info[IDX_GETA_GMO];
  if (v.IsBuffer()) {
    pmqgmo = (PMQGMO)v.As<BUC>().Data();
  } else {
    jsgmo = info[IDX_GETA_GMO].As<Object>();
    pmqgmo = &mqgmo;
    copyGMOtoC(env, jsgmo, pmqgmo);
  }

  v = info[IDX_GETA_APP_CALLBACK];

  // Add a map entry that holds any necessary control information that we need to know later.
  // JS objects need to be marked persistent so they don't get GC'd until we free the objContext during
  // MQCLOSE().
  ObjContext *objContext = new ObjContext;
  objContext->appCBRef = Persistent(v.As<Function>());

  Object jsHObj = info[IDX_GETA_JSHOBJ].As<Object>();
  objContext->jsHObjRef = Persistent(jsHObj);
  objContext->result = Persistent(Object::New(env));

  objContextMap[makeKey(hConn, hObj)] = objContext;

  mqcbd.CallbackFunction = (MQPTR)mqnCB;
  mqcbd.Options |= MQCBDO_FAIL_IF_QUIESCING;
  mqcbd.CallbackArea = objContext;

  bool alreadyActive = true;

  // Registering a message/event callback requires that there be no active async operations.
  // So we temporarily suspend any that might be going on.
  // The first MQCTL may fail if there is no active async thread. It's fine ... we
  // just note the fact so that we can decide whether to do a start or resume in a moment
  // Add an hConn context map entry if there's not already one
  if (connContextMap.count(hConn) == 0) {
    connContextMap[hConn] = new ConnContext;
  }

  if (!useCtl) {
    bool suspended = false;
    int i;
    for (i = 0; i < 5 && !suspended; i++) {
      _MQCTL(hConn, MQOP_SUSPEND, &mqctlo, &CC, &RC);
      debugf(LOG_DEBUG, "GETASYNC - MQCTL(1)    CC:%d RC %d", CC, RC);

      if (RC == MQRC_NONE) {
        suspended = true;
      } else if (RC == MQRC_OPERATION_NOT_ALLOWED) {
        alreadyActive = false;
        suspended = true;
      }
    }
  }

  _MQCB(hConn, MQOP_REGISTER, &mqcbd, hObj, pmqmd, pmqgmo, &CC, &RC);
  debugf(LOG_DEBUG, "GETASYNC - MQCB    CC:%d RC %d", CC, RC);

  if (!useCtl) {
    MQLONG tmpCC,tmpRC;
    _MQCTL(hConn, alreadyActive ? MQOP_RESUME : MQOP_START, &mqctlo, &tmpCC, &tmpRC);
    debugf(LOG_DEBUG, "GETASYNC - MQCTL(2)    CC:%d RC %d", tmpCC, tmpRC);
  }

  result.Set("jsCc", Number::New(env, CC));
  result.Set("jsRc", Number::New(env, RC));

  return result;
}
#undef VERB

/***************************************************************************************************************
 * The application calls this to remove any listeners for the hObj.
 */
#define VERB "GETDONE"
Object GETDONE(const CallbackInfo &info) {
  enum { IDX_GETDONE_HCONN = 0, IDX_GETDONE_HOBJ, IDX_LAST };

  Env env = info.Env();

  if (info.Length() != IDX_LAST) {
    throwTE(env, VERB, "Wrong number of arguments");
  }

  MQHCONN hConn = info[IDX_GETDONE_HCONN].As<Number>().Int32Value();
  MQHOBJ hObj = info[IDX_GETDONE_HOBJ].As<Number>().Int32Value();

  MQLONG CC = -1;
  MQLONG RC = -1;

  Object result = Object::New(env);
  cleanupObjectContext(hConn, hObj, &CC, &RC, true);

  result.Set("jsCc", Number::New(env, CC));
  result.Set("jsRc", Number::New(env, RC));

  return result;
}
#undef VERB

#define VERB "CTL"
Object CTL(const CallbackInfo &info) {
  enum { IDX_CTL_HCONN = 0, IDX_CTL_OPERATION, IDX_LAST };

  Env env = info.Env();

  if (info.Length() != IDX_LAST) {
    throwTE(env, VERB, "Wrong number of arguments");
  }

  MQHCONN hConn = info[IDX_CTL_HCONN].As<Number>().Int32Value();
  MQLONG operation = info[IDX_CTL_OPERATION].As<Number>().Int32Value();
  MQCTLO ctlo = {MQCTLO_DEFAULT};
  MQLONG CC = -1;
  MQLONG RC = -1;

  _MQCTL(hConn, operation, &ctlo, &CC, &RC);

  Object result = Object::New(env);
  result.Set("jsCc", Number::New(env, CC));
  result.Set("jsRc", Number::New(env, RC));

  return result;
}
#undef VERB

/***************************************************************************************************************
 * Tuning parameters can be set in the application and passed to here (where they may affect async consume).
 */
int maxConsecutiveGetsDefault = 1000;
int getLoopDelayTimeMsDefault = 250;
#define VERB "SetTuningParameters"
void SetTuningParameters(const CallbackInfo &info) {
  Env env = info.Env();

  if (info.Length() != 1) {
    throwTE(env, VERB, "Wrong number of arguments");
  }
  Object tuningParameters = info[0].As<Object>();
  dumpObject(env, "TuningParameters", tuningParameters);
  config.maxConsecutiveGets = tuningParameters.Get("maxConsecutiveGets").As<Number>().Int32Value();
  config.getLoopDelayTimeMs = tuningParameters.Get("getLoopDelayTimeMs").As<Number>().Int32Value();
  string s = tuningParameters.Get("callbackStrategy").As<String>();
  transform(s.begin(), s.end(), s.begin(), ::toupper);
  if (s.compare("READAHEAD") == 0) {
    callbackStrategy = CB_READAHEAD;
  } else {
    callbackStrategy = CB_SYNCED;
  }
}
#undef VERB

/***************************************************************************************************************
 * A set of functions to manage application contexts that may need to be passed around. Some information needs
 * to be held against the hConn/hObj as it is not available in the MQI or easy to pass through the callback context structures.
 *
 * Closing a queue requires that any async consumer is deregistered; deregistration requires that the connection async environment
 * is halted. So the cleanup operation for a queue does an MQCTL(suspend), MQCB(dereg), MQCTL(resume). Similarly, disconnecting from the
 * queue manager requires that the whole async environmetn is not active.
 */

std::string makeKey(MQHCONN hConn, MQHOBJ hObj) {
  string s;
  if (hObj == HOBJ_WILDCARD) { // special case for
    s = std::to_string(hConn) + "/";
  } else {
    s = std::to_string(hConn) + "/" + std::to_string(hObj);
  }
  debugf(LOG_DEBUG, "MakeKey: %s mapCount: %d", s.c_str(), objContextMap.count(s));
  return s;
}

// Get rid of the listener for this object, and remove it from any local context
// Sometimes we don't need to
void cleanupObjectContext(MQHCONN hConn, MQHOBJ hObj, PMQLONG pCC, PMQLONG pRC, bool resume) {

  MQCTLO mqctlo = {MQCTLO_DEFAULT};

  debugf(LOG_DEBUG, "cleanupObjectContext for key %d/%d resume=%b", hConn, hObj, resume);

  // Always clean up the maps, even if the MQCB fails - it is most likely
  // because the hObj has already been removed.
  string key = makeKey(hConn, hObj);
  //processMtx.lock(); // Locking is probably unnecessary
  if (objContextMap.count(key) == 1) {
    ObjContext *objContext = objContextMap[key];
    delete (objContext);
    objContextMap.erase(key);
  }

  _MQCTL(hConn, MQOP_SUSPEND, &mqctlo, pCC, pRC);
  debugf(LOG_DEBUG, "cleanupObjectContext - MQCTL(1) CC:%d RC %d", *pCC, *pRC);

  _MQCB(hConn, MQOP_DEREGISTER, NULL, hObj, NULL, NULL, pCC, pRC);
  debugf(LOG_DEBUG, "cleanupObjectContext - MQCB    CC:%d RC %d", *pCC, *pRC);

  if (resume) {
    _MQCTL(hConn, MQOP_RESUME, &mqctlo, pCC, pRC);
    debugf(LOG_DEBUG, "cleanupObjectContext - MQCTL(2) CC:%d RC %d", *pCC, *pRC);
  }
  //processMtx.unlock();
}

void resumeConnectionContext(MQHCONN hConn) {

  MQCTLO mqctlo = {MQCTLO_DEFAULT};
  MQLONG CC, RC;

  debugf(LOG_DEBUG, "Explicit resume Context");

  _MQCTL(hConn, MQOP_RESUME, &mqctlo, &CC, &RC);
}

// Get rid of the async consumer for the connection - remove all object listeners.
void cleanupConnectionContext(MQHCONN hConn) {
  MQLONG CC;
  MQLONG RC;

  debugf(LOG_DEBUG, "cleanupConnectionContext for keys %d/*", hConn);

  // Don't need to call MQCB, just remove all object contexts for this hConn
  string key = makeKey(hConn, HOBJ_WILDCARD);
  for (auto it = objContextMap.begin(); it != objContextMap.end(); ++it) {
    string mapKey = it->first;
    if (mapKey.find(key, 0) == 0) { // startswith()
      size_t idx = mapKey.find("/", 0);
      if (idx != string::npos && idx < (mapKey.length() - 1)) {
        try {
          auto hObjStr = mapKey.substr(idx + 1); // step past the "/"
          auto hObj = stoi(hObjStr, nullptr);
          // Ignore any problems removing the message listener
          cleanupObjectContext(hConn, hObj, &CC, &RC, false);
        } catch (exception &e) {
          // Bad value - catch the exception just in case there's something odd in the map key
          debugf(LOG_DEBUG,"Caught exception - processing %s in stio: %s ",mapKey.c_str(),e.what());
        }
      }
    }
  }

  processMtx.lock(); /* Protect against attempts to MQDISC from two environments */
  if (connContextMap.count(hConn) == 1) {
    ConnContext *connContext = connContextMap[hConn];
    if (connContext) {
      delete (connContext);
      connContextMap.erase(hConn);
    }
  }
  processMtx.unlock();
}

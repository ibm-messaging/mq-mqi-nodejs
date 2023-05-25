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

/*
 * Invocations of the subscription management verbs in the MQI. MQSUB can be called either synchronously or asynch.
 * MQSUBRQ is always synchronous.
 */

class SubWorker : public Napi::AsyncWorker {
public:
  SubWorker(Function &callback, const CallbackInfo &info) : AsyncWorker(callback) {
    debugf(LOG_OBJECT, "In SUB constructor. Number of parameters = %d \n", (int)info.Length());
  }

  ~SubWorker() { debugf(LOG_OBJECT, "In SUB destructor\n"); }

  void Execute() { _MQSUB(hConn, pmqsd, &hObjQ, &hObjSub, &CC, &RC); }

  void OnOK() {
    debugf(LOG_TRACE, "In SUB OnOK method.\n");

    Object result = Object::New(Env());
    result.Set("jsCc", Number::New(Env(), CC));
    result.Set("jsRc", Number::New(Env(), RC));
    result.Set("jsHObjQ", Number::New(Env(), hObjQ));
    result.Set("jsHObjSub", Number::New(Env(), hObjSub));

    dumpObject(Env(), "Sub Result", result);

    copySDfromC(Env(), jssdRef.Value().As<Object>(), pmqsd);

    Callback().Call({result});
  }

public:
  MQHCONN hConn = MQHC_UNUSABLE_HCONN;
  MQHOBJ hObjSub = MQHO_UNUSABLE_HOBJ;
  MQHOBJ hObjQ = MQHO_UNUSABLE_HOBJ;

  MQLONG CC = -1;
  MQLONG RC = -1;

  Object jssd;
  ObjectReference jssdRef;
  MQSD mqsd = {MQSD_DEFAULT};
  PMQSD pmqsd = NULL;
};

#define VERB "SUB"
Object SUB(const CallbackInfo &info) {

  Env env = info.Env();
  enum { IDX_SUB_HCONN = 0, IDX_SUB_SD, IDX_SUB_HOBJQ, IDX_SUB_CALLBACK, IDX_LAST };

  Function cb;
  bool async = false;
  Object result = Object::New(env);
  if (logLevel >= LOG_OBJECT) {
    result.AddFinalizer(debugDest, mqnStrdup(env,VERB));
  }

  if (info.Length() < 1 || info.Length() > IDX_LAST) {
    throwTE(env, VERB, "Wrong number of arguments");
  }

  if (info.Length() > IDX_SUB_CALLBACK) {
    cb = info[IDX_SUB_CALLBACK].As<Function>();
    async = true;
  } else {
    cb = config.noopFnRef.Value().As<Function>();
  }

  SubWorker *w = new SubWorker(cb, info);

  w->hConn = info[IDX_SUB_HCONN].As<Number>().Int32Value();
  w->hObjQ = info[IDX_SUB_HOBJQ].As<Number>().Int32Value();

  w->jssd = info[IDX_SUB_SD].As<Object>();
  w->pmqsd = &w->mqsd;

  copySDtoC(env, w->jssd, w->pmqsd);

  if (async) {
    w->jssdRef = Persistent(w->jssd);
    w->Queue();
  } else {
    _MQSUB(w->hConn, w->pmqsd, &w->hObjQ, &w->hObjSub, &w->CC, &w->RC);

    result.Set("jsCc", Number::New(env, w->CC));
    result.Set("jsRc", Number::New(env, w->RC));
    result.Set("jsHObjQ", Number::New(env, w->hObjQ));
    result.Set("jsHObjSub", Number::New(env, w->hObjSub));

    copySDfromC(env, w->jssd, w->pmqsd);

    delete (w);
  }

  return result;
}
#undef VERB

#define VERB "SUBRQ"
Object SUBRQ(const CallbackInfo &info) {

  Env env = info.Env();
  enum { IDX_SUBRQ_HCONN = 0, IDX_SUBRQ_HSUB, IDX_SUBRQ_ACTION, IDX_SUBRQ_SRO, IDX_LAST };

  MQHCONN hConn;
  MQHOBJ hSub;
  Object jssro;
  MQSRO mqsro;
  MQLONG action;
  MQLONG CC;
  MQLONG RC;

  if (info.Length() < 1 || info.Length() > IDX_LAST) {
    throwTE(env, VERB, "Wrong number of arguments");
  }

  hConn = info[IDX_SUBRQ_HCONN].As<Number>().Int32Value();
  hSub = info[IDX_SUBRQ_HSUB].As<Number>().Int32Value();
  jssro = info[IDX_SUBRQ_SRO].As<Object>();
  hSub = info[IDX_SUBRQ_HSUB].As<Number>().Int32Value();
  action = info[IDX_SUBRQ_ACTION].As<Number>().Int32Value();

  copySROtoC(env, jssro, &mqsro);

  _MQSUBRQ(hConn, hSub, action, &mqsro, &CC, &RC);
  Object result = Object::New(env);
  result.Set("jsCc", Number::New(env, CC));
  result.Set("jsRc", Number::New(env, RC));

  return result;
}
#undef VERB

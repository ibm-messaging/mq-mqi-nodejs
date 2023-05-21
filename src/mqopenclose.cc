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

class OpenWorker : public Napi::AsyncWorker {
public:
  OpenWorker(Function &callback, const CallbackInfo &info) : AsyncWorker(callback) {
    debugf(LOG_OBJECT, "In OPEN constructor. Number of parameters = %d \n", (int)info.Length());
  }

  ~OpenWorker() { debugf(LOG_OBJECT, "In OPEN destructor\n"); }

  void Execute() { CALLMQI("MQOPEN",MQHCONN,PMQOD,MQLONG,PMQHOBJ,PMQLONG,PMQLONG)(hConn, pmqod, Options, &hObj, &CC, &RC); }

  void OnOK() {
    debugf(LOG_TRACE, "In OPEN OnOK method.\n");

    Object result = Object::New(Env());
    result.Set("jsCc", Number::New(Env(), CC));
    result.Set("jsRc", Number::New(Env(), RC));
    result.Set("jsHObj", Number::New(Env(), hObj));

    debugf(LOG_DEBUG, "HConn was %d", hConn);
    // dumpObject(Env(), "Open Result", result);

    copyODfromC(Env(), jsodRef.Value().As<Object>(), pmqod);
    Callback().Call({result});
  }

public:
  MQHCONN hConn = MQHC_UNUSABLE_HCONN;
  MQLONG CC = -1;
  MQLONG RC = -1;
  MQLONG Options;
  MQHOBJ hObj = MQHO_UNUSABLE_HOBJ;

  Object jsod;
  ObjectReference jsodRef;
  MQOD mqod = {MQOD_DEFAULT};
  PMQOD pmqod = NULL;
};

#define VERB "OPEN"
Object OPEN(const CallbackInfo &info) {

  Env env = info.Env();
  enum { IDX_OPEN_HCONN = 0, IDX_OPEN_OD, IDX_OPEN_OPTIONS, IDX_OPEN_CALLBACK };

  Function cb;
  bool async = false;
  Object result = Object::New(env);
  if (logLevel >= LOG_OBJECT) {
    result.AddFinalizer(debugDest, mqnStrdup(env,VERB));
  }

  if (info.Length() < 1 || info.Length() > IDX_OPEN_CALLBACK + 1) {
    throwTE(env, VERB, "Wrong number of arguments");
  }

  if (info.Length() > IDX_OPEN_CALLBACK) {
    cb = info[IDX_OPEN_CALLBACK].As<Function>();
    async = true;
  } else {
    cb = config.noopFnRef.Value().As<Function>();
  }

  OpenWorker *w = new OpenWorker(cb, info);

  w->jsod = info[IDX_OPEN_OD].As<Object>();
  w->Options = info[IDX_OPEN_OPTIONS].As<Number>().Int32Value();
  w->hConn = info[IDX_OPEN_HCONN].As<Number>().Int32Value();
  w->pmqod = &w->mqod;

  copyODtoC(env, w->jsod, w->pmqod);

  // dumpObject(env, "MQOD before calling MQOPEN", w->jsod);

  if (async) {
    w->jsodRef = Persistent(w->jsod);
    w->Queue();
  } else {
    CALLMQI("MQOPEN",MQHCONN,PMQOD,MQLONG,PMQHOBJ,PMQLONG,PMQLONG)(w->hConn, w->pmqod, w->Options, &w->hConn, &w->CC, &w->RC);

    result.Set("jsCc", Number::New(env, w->CC));
    result.Set("jsRc", Number::New(env, w->RC));
    result.Set("jsHObj", Number::New(env, w->hObj));

    copyODfromC(env, w->jsod, w->pmqod);

    delete (w);
  }

  return result;
}
#undef VERB

/****************************************************************************************/

class CloseWorker : public Napi::AsyncWorker {
public:
  CloseWorker(Function &callback, const CallbackInfo &info) : AsyncWorker(callback) {
    debugf(LOG_OBJECT, "In CLOSE constructor. Number of parameters = %d \n", (int)info.Length());
  }

  ~CloseWorker() { debugf(LOG_OBJECT, "In CLOSE destructor\n"); }

  void Execute() { CALLMQI("MQCLOSE",MQHCONN,PMQHOBJ,MQLONG,PMQLONG,PMQLONG)(hConn, &hObj, Options, &CC, &RC); }

  void OnOK() {
    debugf(LOG_TRACE, "In CLOSE OnOK method.\n");

    Object result = Object::New(Env());
    result.Set("jsCc", Number::New(Env(), CC));
    result.Set("jsRc", Number::New(Env(), RC));
    result.Set("jsHObj", Number::New(Env(), hObj));

    // Remove any async consumers
    cleanupObjectContext(hConn,hObj,&CC,&RC);

    // dumpObject(Env(), "Close Result", result);
    Callback().Call({result});
  }

public:
  MQHCONN hConn = MQHC_UNUSABLE_HCONN;
  MQLONG CC = -1;
  MQLONG RC = -1;
  MQLONG Options;
  MQHOBJ hObj = MQHO_UNUSABLE_HOBJ;
};

#define VERB "CLOSE"
Object CLOSE(const CallbackInfo &info) {

  Env env = info.Env();
  enum { IDX_CLOSE_HCONN = 0, IDX_CLOSE_HOBJ, IDX_CLOSE_OPTIONS, IDX_CLOSE_CALLBACK };

  Function cb;
  bool async = false;
  Object result = Object::New(env);
  if (logLevel >= LOG_OBJECT) {
    result.AddFinalizer(debugDest, mqnStrdup(env,VERB));
  }

  if (info.Length() < 1 || info.Length() > IDX_CLOSE_CALLBACK + 1) {
    throwTE(env, VERB, "Wrong number of arguments");
  }

  if (info.Length() > IDX_CLOSE_CALLBACK) {
    cb = info[IDX_CLOSE_CALLBACK].As<Function>();
    async = true;
  } else {
    cb = config.noopFnRef.Value().As<Function>();
  }

  CloseWorker *w = new CloseWorker(cb, info);

  w->Options = info[IDX_CLOSE_OPTIONS].As<Number>().Int32Value();
  w->hConn = info[IDX_CLOSE_HCONN].As<Number>().Int32Value();
  w->hObj = info[IDX_CLOSE_HOBJ].As<Number>().Int32Value();

  if (async) {
    w->Queue();
  } else {
    CALLMQI("MQCLOSE",MQHCONN,PMQHOBJ,MQLONG,PMQLONG,PMQLONG)(w->hConn, &w->hObj, w->Options, &w->CC, &w->RC);

    result.Set("jsCc", Number::New(env, w->CC));
    result.Set("jsRc", Number::New(env, w->RC));
    result.Set("jsHObj", Number::New(env, w->hObj));

    // Remove any async consumers
    cleanupObjectContext(w->hConn,w->hObj,&w->CC,&w->RC);

    delete (w);
  }

  return result;
}
#undef VERB

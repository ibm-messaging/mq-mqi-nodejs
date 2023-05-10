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

// Note that using GetSync in a loop without ever returning to and yielding the main thread can
// result in an apparent buffer leak. See https://github.com/nodejs/node/issues/38300

class GetWorker : public Napi::AsyncWorker {
public:
  GetWorker(Function &callback, const CallbackInfo &info) : AsyncWorker(callback) {
    debugf(LOG_OBJECT,"In GET constructor. Number of parameters = %d \n", (int)info.Length());
  }

  ~GetWorker() {
    debugf(LOG_OBJECT,"In GET destructor\n");
  }

  void Execute() { CALLMQI("MQGET")(hConn, hObj, pmqmd, pmqgmo, buflen, buf, &datalen, &CC, &RC); }

  void OnOK() {
    debugf(LOG_TRACE,"In GET OnOK method.\n");

    Object result = Object::New(Env());
    result.Set("jsCc", Number::New(Env(), CC));
    result.Set("jsRc", Number::New(Env(), RC));
    result.Set("jsDatalen", Number::New(Env(), datalen));

    copyMDfromC(Env(),jsmdRef.Value().As<Object>(),pmqmd);
    copyGMOfromC(Env(),jsgmoRef.Value().As<Object>(),pmqgmo);

    //dumpObject(Env(),"MQMD in OnOK",this->jsmdRef.Value().As<Object>());
    Callback().Call({result}); 
  }

public:
  MQHCONN hConn = MQHC_UNUSABLE_HCONN;
  MQHOBJ hObj = MQHO_UNUSABLE_HOBJ;

  MQLONG CC = -1;
  MQLONG RC = -1;

  MQLONG datalen;
  MQLONG buflen;
  MQPTR  buf;

  Object jsmd;
  ObjectReference jsmdRef;
  MQMD mqmd = {MQMD_DEFAULT};
  PMQMD pmqmd = NULL;

  Object jsgmo;
  ObjectReference jsgmoRef;
  MQGMO mqgmo = {MQGMO_DEFAULT};
  PMQGMO pmqgmo = NULL;

};

#define VERB "GET"
Object GET(const CallbackInfo &info) {

  Env env = info.Env();
  enum { IDX_GET_HCONN = 0, IDX_GET_HOBJ, IDX_GET_MD, IDX_GET_GMO, IDX_GET_BUFFER, IDX_GET_CALLBACK };

  Function cb;
  bool async = false;
  Object result = Object::New(env);
  if (config.logLevel >= LOG_OBJECT) {
    result.AddFinalizer(debugDest, strdup(VERB));
  }

  if (info.Length() < 1 || info.Length() > IDX_GET_CALLBACK + 1) {
    throwTE(env, VERB, "Wrong number of arguments");
  }

  if (info.Length() > IDX_GET_CALLBACK ) {
    cb = info[IDX_GET_CALLBACK].As<Function>();
    async = true;
  } else {
    cb = config.noopFnRef.Value().As<Function>();
  }

  GetWorker *w = new GetWorker(cb, info);

  w->hConn = info[IDX_GET_HCONN].As<Number>().Int32Value();
  w->hObj  = info[IDX_GET_HOBJ].As<Number>().Int32Value();

  w->jsmd = info[IDX_GET_MD].As<Object>();
  w->jsgmo = info[IDX_GET_GMO].As<Object>();

  w->pmqmd = &w->mqmd;
  w->pmqgmo = &w->mqgmo;

  Value v = info[IDX_GET_BUFFER];

  if (v.IsNull()) {
    w->buf = NULL;
    w->buflen = 0;
  } else {
    Buffer<unsigned char> b = v.As<Buffer<unsigned char>>();
    if (config.logLevel >= LOG_OBJECT)
      b.AddFinalizer(debugDest,strdup("BufferB"));
    w->buf   = b.Data();
    w->buflen= b.Length();
  }

  copyMDtoC(env,w->jsmd,w->pmqmd);
  copyGMOtoC(env,w->jsgmo,w->pmqgmo);
  
  if (async) {
    w->jsmdRef = Persistent(w->jsmd);
    w->jsgmoRef = Persistent(w->jsgmo);

    w->Queue();
  } else {
    CALLMQI("MQGET")(w->hConn, w->hObj, w->pmqmd, w->pmqgmo, w->buflen, w->buf, &w->datalen, &w->CC, &w->RC);

    result.Set("jsCc", Number::New(env, w->CC));
    result.Set("jsRc", Number::New(env, w->RC));
    result.Set("jsDatalen", Number::New(env, w->datalen));

    copyGMOfromC(env,w->jsgmo,w->pmqgmo);
    copyMDfromC(env,w->jsmd,w->pmqmd);
        
    delete (w);
  }

  return result;
}
#undef VERB

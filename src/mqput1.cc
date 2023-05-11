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

class Put1Worker : public Napi::AsyncWorker {
public:
  Put1Worker(Function &callback, const CallbackInfo &info) : AsyncWorker(callback) {
    debugf(LOG_OBJECT, "In PUT1 constructor. Number of parameters = %d \n", (int)info.Length());
  }

  ~Put1Worker() { debugf(LOG_OBJECT, "In PUT1 destructor\n"); }

  void Execute() { CALLMQI("MQPUT1",MQHCONN,PMQOD,PMQMD,PMQPMO,MQLONG,PMQVOID,PMQLONG,PMQLONG)(hConn, pmqod, pmqmd, pmqpmo, buflen, buf, &CC, &RC); }

  void OnOK() {
    debugf(LOG_TRACE, "In PUT1 OnOK method.\n");

    Object result = Object::New(Env());
    result.Set("jsCc", Number::New(Env(), CC));
    result.Set("jsRc", Number::New(Env(), RC));

    //dumpObject(Env(), "Put1 Result", result);

    copyMDfromC(Env(), jsmdRef.Value().As<Object>(), pmqmd);
    copyPMOfromC(Env(), jspmoRef.Value().As<Object>(), pmqpmo);
    copyODfromC(Env(), jsodRef.Value().As<Object>(), pmqod);

    //dumpObject(Env(), "MQMD in OnOK", this->jsmdRef.Value().As<Object>());
    Callback().Call({result});
  }

public:
  MQHCONN hConn = MQHC_UNUSABLE_HCONN;

  MQLONG CC = -1;
  MQLONG RC = -1;

  MQLONG buflen;
  MQPTR buf;

  Object jsmd;
  ObjectReference jsmdRef;
  MQMD mqmd = {MQMD_DEFAULT};
  PMQMD pmqmd = NULL;

  Object jsod;
  ObjectReference jsodRef;
  MQOD mqod = {MQOD_DEFAULT};
  PMQOD pmqod = NULL;

  Object jspmo;
  ObjectReference jspmoRef;
  MQPMO mqpmo = {MQPMO_DEFAULT};
  PMQPMO pmqpmo = NULL;
};

#define VERB "PUT1"
Object PUT1(const CallbackInfo &info) {

  Env env = info.Env();
  enum { IDX_PUT1_HCONN = 0, IDX_PUT1_OD, IDX_PUT1_MD, IDX_PUT1_PMO, IDX_PUT1_BUFFER, IDX_PUT1_CALLBACK };

  Function cb;
  bool async = false;
  Object result = Object::New(env);
  if (config.logLevel >= LOG_OBJECT) {
    result.AddFinalizer(debugDest, strdup(VERB));
  }

  if (info.Length() < 1 || info.Length() > IDX_PUT1_CALLBACK + 1) {
    throwTE(env, VERB, "Wrong number of arguments");
  }

  if (info.Length() > IDX_PUT1_CALLBACK) {
    cb = info[IDX_PUT1_CALLBACK].As<Function>();
    async = true;
  } else {
    cb = config.noopFnRef.Value().As<Function>();
  }

  Put1Worker *w = new Put1Worker(cb, info);

  w->hConn = info[IDX_PUT1_HCONN].As<Number>().Int32Value();

  w->jsod = info[IDX_PUT1_OD].As<Object>();
  w->jsmd = info[IDX_PUT1_MD].As<Object>();
  w->jspmo = info[IDX_PUT1_PMO].As<Object>();

  w->pmqmd = &w->mqmd;
  w->pmqpmo = &w->mqpmo;
  w->pmqod = &w->mqod;

  // The calling layer has already converted String input1 to a Buffer
  Value v = info[IDX_PUT1_BUFFER];

  if (v.IsNull()) {
    w->buf = NULL;
    w->buflen = 0;
  } else {
    Buffer<unsigned char> b = v.As<Buffer<unsigned char>>();
    w->buf = b.Data();
    w->buflen = b.Length();
  }

  copyODtoC(env, w->jsod, w->pmqod);
  copyMDtoC(env, w->jsmd, w->pmqmd);
  copyPMOtoC(env, w->jspmo, w->pmqpmo);

  if (async) {
    w->jsmdRef = Persistent(w->jsmd);
    w->jspmoRef = Persistent(w->jspmo);
    w->jsodRef = Persistent(w->jsod);

    w->Queue();
  } else {
    CALLMQI("MQPUT1",MQHCONN,PMQOD,PMQMD,PMQPMO,MQLONG,PMQVOID,PMQLONG,PMQLONG)(w->hConn, w->pmqod, w->pmqmd, w->pmqpmo, w->buflen, w->buf, &w->CC, &w->RC);

    result.Set("jsCc", Number::New(env, w->CC));
    result.Set("jsRc", Number::New(env, w->RC));

    copyPMOfromC(env, w->jspmo, w->pmqpmo);
    copyMDfromC(env, w->jsmd, w->pmqmd);
    copyODfromC(env, w->jsod, w->pmqod);

    delete (w);
  }

  return result;
}
#undef VERB

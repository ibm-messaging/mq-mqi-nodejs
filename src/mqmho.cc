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
     Mark Taylor - Initial Contribution
*/

#include "mqi.h"

#define VERB "CRTMH"
Object CRTMH(const CallbackInfo &info) {
  
  Env env = info.Env();
  enum { IDX_CRTMH_HCONN = 0, IDX_CRTMH_CMHO };

  MQHCONN hConn;
  MQCMHO cmho = {MQCMHO_DEFAULT};
  Object jsCmho;
  MQLONG CC;
  MQLONG RC;
  MQHMSG hMsg;

  if (info.Length() < 1 || info.Length() > IDX_CRTMH_CMHO + 1) {
    throwTE(env, VERB, "Wrong number of arguments");
  }

  hConn = info[IDX_CRTMH_HCONN].As<Number>().Int32Value();
  jsCmho = info[IDX_CRTMH_CMHO].As<Object>();
  cmho.Options = getMQLong(jsCmho,"Options"); // Only item to copy over

  CALLMQI("MQCRTMH")(hConn, &cmho, &hMsg, &CC, &RC);

  Object result = Object::New(env);
  result.Set("jsCc", Number::New(env, CC));
  result.Set("jsRc", Number::New(env, RC));
  result.Set("jsHMsg", BigInt::New(env, (int64_t)hMsg)); // Message handles are 64-bit

  return result;
}
#undef VERB

#define VERB "DLTMH"
Object DLTMH(const CallbackInfo &info) {

  Env env = info.Env();
  enum { IDX_DLTMH_HCONN = 0, IDX_DLTMH_HMSG, IDX_DLTMH_DMHO };

  MQHCONN hConn;
  MQDMHO dmho = {MQDMHO_DEFAULT};
  MQHMSG hMsg;
  Object jsDmho;
  MQLONG CC;
  MQLONG RC;
  bool b;

  if (info.Length() < 1 || info.Length() > IDX_DLTMH_DMHO + 1) {
    throwTE(env, VERB, "Wrong number of arguments");
  }

  hConn = info[IDX_DLTMH_HCONN].As<Number>().Int32Value();
  jsDmho = info[IDX_DLTMH_DMHO].As<Object>();
  dmho.Options = getMQLong(jsDmho,"Options"); // Only item to copy over
  hMsg = info[IDX_DLTMH_HMSG].As<BigInt>().Int64Value(&b);

  CALLMQI("MQDLTMH")(hConn, &hMsg, &dmho, &CC, &RC);

  Object result = Object::New(env);
  result.Set("jsCc", Number::New(env, CC));
  result.Set("jsRc", Number::New(env, RC));

  return result;
}
#undef VERB

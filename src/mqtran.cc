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
 * Invocations of the transaction management verbs in the MQI. These are all executed synchronously.
 */

#define VERB "BEGIN"
Object BEGIN(const CallbackInfo &info) {
  enum { IDX_BEGIN_HCONN = 0, IDX_LAST };

  Env env = info.Env();

  MQHCONN hConn;
  MQLONG CC;
  MQLONG RC;

  if (info.Length() < 1 || info.Length() > IDX_LAST) {
    throwTE(env, VERB, "Wrong number of arguments");
  }

  hConn = info[IDX_BEGIN_HCONN].As<Number>().Int32Value();

  _MQBEGIN(hConn, &CC, &RC);
  
  Object result = Object::New(env);
  result.Set("jsCc", Number::New(env, CC));
  result.Set("jsRc", Number::New(env, RC));

  return result;
}
#undef VERB

#define VERB "CMIT"
Object CMIT(const CallbackInfo &info) {

  Env env = info.Env();
  enum { IDX_CMIT_HCONN = 0, IDX_LAST };

  MQHCONN hConn;
  MQLONG CC;
  MQLONG RC;

  if (info.Length() < 1 || info.Length() > IDX_LAST) {
    throwTE(env, VERB, "Wrong number of arguments");
  }

  hConn = info[IDX_CMIT_HCONN].As<Number>().Int32Value();

  _MQCMIT(hConn, &CC, &RC);
  
  Object result = Object::New(env);
  result.Set("jsCc", Number::New(env, CC));
  result.Set("jsRc", Number::New(env, RC));

  return result;
}
#undef VERB

#define VERB "BACK"
Object BACK(const CallbackInfo &info) {

  Env env = info.Env();
  enum { IDX_BACK_HCONN = 0, IDX_LAST };

  MQHCONN hConn;
  MQLONG CC;
  MQLONG RC;

  if (info.Length() < 1 || info.Length() > IDX_LAST) {
    throwTE(env, VERB, "Wrong number of arguments");
  }

  hConn = info[IDX_BACK_HCONN].As<Number>().Int32Value();
  _MQBACK(hConn, &CC, &RC);
  Object result = Object::New(env);
  result.Set("jsCc", Number::New(env, CC));
  result.Set("jsRc", Number::New(env, RC));

  return result;
}
#undef VERB
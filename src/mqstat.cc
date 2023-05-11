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

#define VERB "STAT"
Object STAT(const CallbackInfo &info) {

  Env env = info.Env();
  enum { IDX_STAT_HCONN = 0, IDX_STAT_STATUSTYPE, IDX_STAT_STS };

  MQHCONN hConn;
  MQLONG statusType;
  Object jssts;
  MQSTS mqsts = {MQSTS_DEFAULT};
  MQLONG CC;
  MQLONG RC;

  if (info.Length() < 1 || info.Length() > IDX_STAT_STS + 1) {
    throwTE(env, VERB, "Wrong number of arguments");
  }

  hConn = info[IDX_STAT_HCONN].As<Number>().Int32Value();
  statusType = info[IDX_STAT_STATUSTYPE].As<Number>().Int32Value();
  jssts = info[IDX_STAT_STS].As<Object>();

  copySTStoC(env, jssts, &mqsts);

  CALLMQI("MQSTAT",MQHCONN,MQLONG,PMQSTS,PMQLONG,PMQLONG)(hConn, statusType, &mqsts, &CC, &RC);

  copySTSfromC(env, jssts, &mqsts);

  Object result = Object::New(env);
  result.Set("jsCc", Number::New(env, CC));
  result.Set("jsRc", Number::New(env, RC));

  return result;
}
#undef VERB

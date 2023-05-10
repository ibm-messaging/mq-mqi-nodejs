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

void copyGMOtoC(Env env, Object jsgmo, PMQGMO pmqgmo) {
  bool b;

  pmqgmo->Version = MQGMO_VERSION_4; // Assume for now we will always use this */
  pmqgmo->Options = getMQLong(jsgmo,"Options");
  // Force the FIQ option to always be set for good practice
  pmqgmo->Options |= MQGMO_FAIL_IF_QUIESCING;

  pmqgmo->WaitInterval = getMQLong(jsgmo,"WaitInterval");
  pmqgmo->MatchOptions = getMQLong(jsgmo,"MatchOptions");
  pmqgmo->MsgHandle = jsgmo.Get("MsgHandle").As<BigInt>().Int64Value(&b);

  setMQIBytes(env, pmqgmo->MsgToken, jsgmo, "MsgToken", MQ_MSG_TOKEN_LENGTH);

  return;
};

void copyGMOfromC(Env env, Object jsgmo, PMQGMO pmqgmo) {

  jsgmo.Set("Options", Number::New(env, pmqgmo->Options));
  jsgmo.Set("WaitInterval", Number::New(env, pmqgmo->WaitInterval));
  jsgmo.Set("ResolvedQName", getMQIString(env, pmqgmo->ResolvedQName, MQ_Q_NAME_LENGTH));
  jsgmo.Set("GroupStatus", Number::New(env, pmqgmo->GroupStatus));
  jsgmo.Set("SegmentStatus", Number::New(env, pmqgmo->SegmentStatus));
  jsgmo.Set("Segmentation", Number::New(env, pmqgmo->Segmentation));

  getMQIBytes(env, pmqgmo->MsgToken, jsgmo, "MsgToken", MQ_MSG_TOKEN_LENGTH);
 
  jsgmo.Set("ReturnedLength", Number::New(env,pmqgmo->ReturnedLength));

  return;
};

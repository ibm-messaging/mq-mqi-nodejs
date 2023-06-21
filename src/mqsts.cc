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

/* Conversion routines for the MQSTS structure. */

void copySTStoC(Env env, Object jssts, PMQSTS pmqsts) {
  setMQICharV(env, &pmqsts->ObjectString, jssts, NULL, true);
  setMQICharV(env, &pmqsts->SubName, jssts, NULL, true);

  return;
};

void copySTSfromC(Env env, Object jssts, PMQSTS pmqsts) {
  jssts.Set("CompCode", Number::New(env, pmqsts->CompCode));
  jssts.Set("Reason", Number::New(env, pmqsts->Reason));
  jssts.Set("PutSuccessCount", Number::New(env, pmqsts->PutSuccessCount));
  jssts.Set("PutWarningCount", Number::New(env, pmqsts->PutWarningCount));
  jssts.Set("PutFailureCount", Number::New(env, pmqsts->PutFailureCount));

  jssts.Set("ObjectType", Number::New(env, pmqsts->ObjectType));
  jssts.Set("ObjectName", getMQIString(env, pmqsts->ObjectName, MQ_OBJECT_NAME_LENGTH));
  jssts.Set("ObjectQMgrName", getMQIString(env, pmqsts->ObjectQMgrName, MQ_Q_MGR_NAME_LENGTH));
  jssts.Set("ResolvedObjectName", getMQIString(env, pmqsts->ResolvedObjectName, MQ_OBJECT_NAME_LENGTH));
  jssts.Set("ResolvedQMgrName", getMQIString(env, pmqsts->ResolvedQMgrName, MQ_Q_MGR_NAME_LENGTH));

  jssts.Set("ObjectString", getMQICharV(env, &pmqsts->ObjectString, true));
  jssts.Set("SubName", getMQICharV(env, &pmqsts->SubName, true));
  jssts.Set("OpenOptions", Number::New(env, pmqsts->OpenOptions));
  jssts.Set("SubOptions", Number::New(env, pmqsts->SubOptions));

  return;
};

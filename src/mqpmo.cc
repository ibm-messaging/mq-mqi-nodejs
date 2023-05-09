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

void copyPMOtoC(Env env, Object jspmo, PMQPMO pmqpmo) {
  bool b;
  pmqpmo->Version  = MQPMO_VERSION_3;
  pmqpmo->Options          = jspmo.Get("Options").As<Number>();
  // Force the FIQ option to always be set for good practice
  pmqpmo->Options |= MQPMO_FAIL_IF_QUIESCING;

  Object context = jspmo.Get("Context").As<Object>();
  if (!context.IsNull() && !context.IsUndefined()) {
    pmqpmo->Context          = context.Get("_hObj").As<Number>();
  }

  pmqpmo->OriginalMsgHandle = jspmo.Get("OriginalMsgHandle").As<BigInt>().Int64Value(&b);
  pmqpmo->NewMsgHandle      = jspmo.Get("NewMsgHandle").As<BigInt>().Int64Value(&b);
  pmqpmo->Action            = jspmo.Get("Action").As<Number>();
  pmqpmo->PubLevel          = jspmo.Get("PubLevel").As<Number>();
  return;
};

void copyPMOfromC(Env env, Object jspmo, PMQPMO pmqpmo) {

  jspmo.Set("Options",  Number::New(env,pmqpmo->Options));
  jspmo.Set("ResolvedQName"   , getMQIString(env,pmqpmo->ResolvedQName, MQ_Q_NAME_LENGTH));
  jspmo.Set("ResolvedQMgrName", getMQIString(env,pmqpmo->ResolvedQMgrName, MQ_Q_MGR_NAME_LENGTH));

  jspmo.Set("OriginalMsgHandle",  BigInt::New(env,pmqpmo->OriginalMsgHandle));
  jspmo.Set("NewMsgHandle"     ,  BigInt::New(env,pmqpmo->NewMsgHandle));
  jspmo.Set("PubLevel"         ,  Number::New(env,pmqpmo->PubLevel));

  return;
};

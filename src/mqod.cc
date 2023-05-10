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

void copyODtoC(Env env, Object jsod, PMQOD pmqod) {
  pmqod->Version = 4; // We will always use this version.
  pmqod->ObjectType = getMQLong(jsod,"ObjectType");
  setMQIString(env, pmqod->ObjectName,jsod,"ObjectName", MQ_Q_NAME_LENGTH); 
  setMQIString(env, pmqod->ObjectQMgrName,jsod,"ObjectQMgrName",MQ_Q_MGR_NAME_LENGTH);

  setMQIString(env, pmqod->DynamicQName, jsod, "DynamicQName", MQ_Q_NAME_LENGTH);
  setMQIString(env, pmqod->AlternateUserId, jsod, "AlternateUserId", MQ_USER_ID_LENGTH);
  setMQIBytes(env, pmqod->AlternateSecurityId, jsod,"AlternateSecurityId",MQ_SECURITY_ID_LENGTH);

  setMQICharV(env,&pmqod->ObjectString, jsod,"ObjectString",true);
  setMQICharV(env,&pmqod->SelectionString, jsod,"SelectionString", true);
  setMQICharV(env,&pmqod->ResObjectString, jsod, "ResObjectString", true);

  pmqod->ResolvedType = getMQLong(jsod,"ResolvedType");
}

void copyODfromC(Env env, Object jsod, PMQOD pmqod) {

  jsod.Set("ObjectType", Number::New(env,pmqod->ObjectType));
  jsod.Set("ObjectName", getMQIString(env,pmqod->ObjectName, MQ_Q_NAME_LENGTH));

  jsod.Set("ObjectQMgrName",getMQIString(env,pmqod->ObjectQMgrName,MQ_Q_MGR_NAME_LENGTH));
  jsod.Set("DynamicQName", getMQIString(env,pmqod->DynamicQName,MQ_Q_NAME_LENGTH));
  jsod.Set("AlternateUserId", getMQIString(env,pmqod->AlternateUserId,MQ_USER_ID_LENGTH));

  jsod.Set("ResolvedQName",getMQIString(env,pmqod->ResolvedQName,MQ_Q_NAME_LENGTH));
  jsod.Set("ResolvedQMgrName",getMQIString(env,pmqod->ResolvedQMgrName, MQ_Q_MGR_NAME_LENGTH));

  jsod.Set("ResolvedType", Number::New(env,pmqod->ResolvedType));

  getMQIBytes(env,pmqod->AlternateSecurityId,jsod,"AlternateSecurityId",MQ_SECURITY_ID_LENGTH);


  jsod.Set("ObjectString" , getMQICharV(env,&pmqod->ObjectString,true));
  jsod.Set("SelectionString", getMQICharV(env,&pmqod->SelectionString,true));
  jsod.Set("ResObjectString",  getMQICharV(env,&pmqod->ResObjectString,true));

}

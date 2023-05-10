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

void copySDtoC(Env env, Object jssd, PMQSD pmqsd) {

  pmqsd->Version = 1; // Only version for now
  pmqsd->Options = getMQLong(jssd,"Options");

  setMQIString(env, pmqsd->ObjectName, jssd, "ObjectName", MQ_Q_NAME_LENGTH);
  setMQIString(env, pmqsd->AlternateUserId, jssd, "AlternateUserId", MQ_USER_ID_LENGTH);
  setMQIBytes(env, pmqsd->AlternateSecurityId, jssd, "AlternateSecurityId", MQ_SECURITY_ID_LENGTH);
  pmqsd->SubExpiry = getMQLong(jssd,"SubExpiry");

  setMQICharV(env, &pmqsd->ObjectString, jssd, "ObjectString", true);
  setMQICharV(env, &pmqsd->SubName, jssd, "SubName", true);
  setMQICharV(env, &pmqsd->SubUserData, jssd, "SubUserData", true);

   setMQIBytes(env, pmqsd->SubCorrelId, jssd, "SubCorrelId", MQ_CORREL_ID_LENGTH);

   pmqsd->PubPriority = getMQLong(jssd,"PubPriority");

   setMQIBytes(env, pmqsd->PubAccountingToken, jssd, "PubAccountingToken", MQ_ACCOUNTING_TOKEN_LENGTH);

   setMQIString(env, pmqsd->PubApplIdentityData, jssd, "PubApplIdentityData", MQ_APPL_IDENTITY_DATA_LENGTH);
   setMQICharV(env, &pmqsd->SelectionString, jssd, "SelectionString", true);
   pmqsd->SubLevel = getMQLong(jssd,"SubLevel");

   /* The resolved topic is output-only so force an empty charv */
   setMQICharV(env, &pmqsd->ResObjectString, jssd, NULL, true);

   return;
};

/*
 * And copy back the fields that might have changed
 */
void copySDfromC(Env env, Object jssd, PMQSD pmqsd) {
   getMQIBytes(env, pmqsd->SubCorrelId, jssd, "SubCorrelId", MQ_CORREL_ID_LENGTH);

   jssd.Set("SubLevel", Number::New(env, pmqsd->SubLevel));
   getMQIBytes(env, pmqsd->PubAccountingToken, jssd, "PubAccountingToken", MQ_ACCOUNTING_TOKEN_LENGTH);

   jssd.Set("ObjectString", getMQICharV(env, &pmqsd->ObjectString, true));
   jssd.Set("SubName", getMQICharV(env, &pmqsd->SubName, true));
   jssd.Set("SubUserData", getMQICharV(env, &pmqsd->SubUserData, true));
   jssd.Set("SelectionString", getMQICharV(env, &pmqsd->SelectionString, true));
   jssd.Set("ResObjectString", getMQICharV(env, &pmqsd->ResObjectString, true));

   return;
};

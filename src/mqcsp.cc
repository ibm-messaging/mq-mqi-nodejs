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

/* Conversion routines for the MQCSP structure. There's no need to copy anything back from 
 * the C structure post-call.
 *
 * Strings need to be copied in case they get GC'd out of existence before the structure
 * is used in the MQI. So we also have a cleanup operation.
 */
void copyCSPtoC(Env env, Object jscsp, PMQCSP pmqcsp) {
  
  char *cUserId = NULL;
  char *cPassword = NULL;
  char *cInitialKey = NULL;
  char *cToken = NULL;

  // Set the Authentication type if there's a non-empty Userid specified.
  String UserId = jscsp.Get("UserId").As<String>();
  if (!UserId.IsNull() && !UserId.IsUndefined()) {
    cUserId = mqnStrdup(env,UserId.Utf8Value().c_str());
    pmqcsp->CSPUserIdPtr = cUserId;
    pmqcsp->CSPUserIdOffset = 0;
    pmqcsp->CSPUserIdLength = strlen(cUserId);

    pmqcsp->AuthenticationType = getMQLong(jscsp,"_authenticationType");
    // If you've set a non-blank userid, then you MUST be asking for userid/pwd checking.
    if (pmqcsp->AuthenticationType == MQCSP_AUTH_NONE) {
      pmqcsp->AuthenticationType = MQCSP_AUTH_USER_ID_AND_PWD;
    }
  }

  Object Password = jscsp.Get("Password").As<Object>();
  if (!Password.IsNull() && !Password.IsUndefined()) {
    cPassword = mqnStrdup(env,Password.As<String>().Utf8Value().c_str());
    pmqcsp->CSPPasswordPtr = cPassword;
    pmqcsp->CSPPasswordOffset = 0;
    pmqcsp->CSPPasswordLength = strlen(cPassword);
  }

  Object InitialKey = jscsp.Get("InitialKey").As<Object>();
  if (!InitialKey.IsNull() && !InitialKey.IsUndefined()) {
    cInitialKey = mqnStrdup(env,InitialKey.As<String>().Utf8Value().c_str());
    pmqcsp->InitialKeyPtr = cInitialKey;
    pmqcsp->InitialKeyOffset = 0;
    pmqcsp->InitialKeyLength = strlen(cInitialKey);
    if (pmqcsp->Version < MQCSP_VERSION_2) {
      pmqcsp->Version = MQCSP_VERSION_2;
    }
  }

  Object Token = jscsp.Get("Token").As<Object>();
  if (!Token.IsNull() && !Token.IsUndefined()) {
    cToken = mqnStrdup(env,Token.As<String>().Utf8Value().c_str());
    pmqcsp->TokenPtr = cToken;
    pmqcsp->TokenOffset = 0;
    pmqcsp->TokenLength = strlen(cToken);
    // Using a token overrides userid/password checking
    pmqcsp->AuthenticationType = MQCSP_AUTH_ID_TOKEN;
    if (pmqcsp->Version < MQCSP_VERSION_3) {
      pmqcsp->Version = MQCSP_VERSION_3;
    }
  }
}

void cleanupCSP(PMQCSP pCsp) {
    if (pCsp) {
      mqnFreeString(pCsp->CSPUserIdPtr);
      mqnFreeString(pCsp->CSPPasswordPtr);
      mqnFreeString(pCsp->InitialKeyPtr);
      mqnFreeString(pCsp->TokenPtr);
    }
}

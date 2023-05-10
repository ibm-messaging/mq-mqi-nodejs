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

void copyCSPtoC(Env env, Object jscsp, PMQCSP pmqcsp) {
  
  char *cUserId = NULL;
  char *cPassword = NULL;
  char *cInitialKey = NULL;

  // Set the Authentication type if there's a non-empty Userid specified.
  // There's only one non-default option for now. We don't copy it into the
  // C structure if the userid is empty because the CSP might be being used
  // only for the InitialKey setting.
  String UserId = jscsp.Get("UserId").As<String>();
  if (!UserId.IsNull() && !UserId.IsUndefined()) {
    cUserId = strdup(UserId.Utf8Value().c_str());
    pmqcsp->CSPUserIdPtr = cUserId;
    pmqcsp->CSPUserIdOffset = 0;
    pmqcsp->CSPUserIdLength = strlen(cUserId);

    pmqcsp->AuthenticationType = getMQLong(jscsp,"_authenticationType");
  }

  Object Password = jscsp.Get("Password").As<Object>();
  if (!Password.IsNull() && !Password.IsUndefined()) {
    cPassword = strdup(Password.As<String>().Utf8Value().c_str());
    pmqcsp->CSPPasswordPtr = cPassword;
    pmqcsp->CSPPasswordOffset = 0;
    pmqcsp->CSPPasswordLength = strlen(cPassword);
  }

  Object InitialKey = jscsp.Get("InitialKey").As<Object>();
  if (!InitialKey.IsNull() && !InitialKey.IsUndefined()) {
    cInitialKey = strdup(InitialKey.As<String>().Utf8Value().c_str());
    pmqcsp->InitialKeyPtr = cInitialKey;
    pmqcsp->InitialKeyOffset = 0;
    pmqcsp->InitialKeyLength = strlen(cInitialKey);
  }
}

void cleanupCSP(PMQCSP pCsp) {
    if (pCsp) {
      mqFreeString(pCsp->CSPUserIdPtr);
      mqFreeString(pCsp->CSPPasswordPtr);
      mqFreeString(pCsp->InitialKeyPtr);
    }
}
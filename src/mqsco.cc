/*
  Copyright (c) IBM Corporation 2017, 2023

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

void copySCOtoC(Env env, Object jssco, PMQSCO pmqsco) {

  setMQIString(env,pmqsco->KeyRepository, jssco, "KeyRepository",MQ_SSL_KEY_REPOSITORY_LENGTH);
  setMQIString(env,pmqsco->CryptoHardware,jssco, "CryptoHardware", MQ_SSL_CRYPTO_HARDWARE_LENGTH);
  pmqsco->KeyResetCount     = getMQLong(jssco,"KeyResetCount");
  pmqsco->FipsRequired      = jssco.Get("FipsRequired").As<Boolean>()?MQSSL_FIPS_YES:MQSSL_FIPS_NO;

  Array a = jssco.Get("EncryptionPolicySuiteB").As<Array>();
  for (int i = 0;i<4;i++) {
    Value v = a[i];
    pmqsco->EncryptionPolicySuiteB[i] = v.As<Number>().Int32Value();
  }
  pmqsco->CertificateValPolicy = getMQLong(jssco,"CertificateValPolicy");
  setMQIString(env, pmqsco->CertificateLabel , jssco,"CertificateLabel",MQ_CERT_LABEL_LENGTH);

  Value v = jssco.Get("KeyRepoPassword");
  if (v.IsString()) {
    pmqsco->KeyRepoPasswordPtr = strdup(jssco.Get("KeyRepoPassword").As<String>().Utf8Value().c_str());
    pmqsco->KeyRepoPasswordOffset = 0;
    pmqsco->KeyRepoPasswordLength = strlen((char *)pmqsco->KeyRepoPasswordPtr);
    if (pmqsco->Version < 6) {
      pmqsco->Version = 6;
    }
  }

  return;
};

void copySCOfromC(Env env, Object jssco, PMQSCO pmqsco) {
  return;
};

void cleanupSCO(PMQSCO pmqsco) {
  if (pmqsco) {
    mqFreeString(pmqsco->KeyRepoPasswordPtr);
  }
  return;
}

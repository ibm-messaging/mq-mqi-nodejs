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

void copyCDtoC(Env env, Object jscd, PMQCD pmqcd) {
  int i;

  setMQIString(env, pmqcd->ChannelName, jscd, "ChannelName", MQ_CHANNEL_NAME_LENGTH);
  setMQIString(env, pmqcd->ConnectionName, jscd, "ConnectionName", MQ_CONN_NAME_LENGTH);
  pmqcd->DiscInterval = getMQLong(jscd,"DiscInterval");
  setMQIString(env, pmqcd->SecurityExit, jscd, "SecurityExit", MQ_EXIT_NAME_LENGTH);
  setMQIString(env, pmqcd->SecurityUserData, jscd, "SecurityUserData", MQ_EXIT_DATA_LENGTH);
  pmqcd->MaxMsgLength = getMQLong(jscd,"MaxMsgLength");
  pmqcd->HeartbeatInterval =getMQLong(jscd,"HeartbeatInterval");
  setMQIString(env, pmqcd->SSLCipherSpec, jscd, "SSLCipherSpec", MQ_SSL_CIPHER_SPEC_LENGTH);

  Value v = jscd.Get("SSLPeerName");
  if (v.IsString()) {
    pmqcd->SSLPeerNamePtr = mqnStrdup(env,v.As<String>().Utf8Value().c_str());
    pmqcd->SSLPeerNameLength = strlen((char *)pmqcd->SSLPeerNamePtr);
  }
  pmqcd->SSLClientAuth = getMQLong(jscd,"SSLClientAuth");
  pmqcd->KeepAliveInterval = getMQLong(jscd,"KeepAliveInterval");
  pmqcd->SharingConversations = getMQLong(jscd,"SharingConversations");
  pmqcd->PropertyControl = getMQLong(jscd,"PropertyControl");
  pmqcd->ClientChannelWeight = getMQLong(jscd,"ClientChannelWeight");
  pmqcd->ConnectionAffinity = getMQLong(jscd,"ConnectionAffinity");
  pmqcd->DefReconnect = getMQLong(jscd,"DefReconnect");
  
  setMQIString(env, pmqcd->CertificateLabel, jscd, "CertificateLabel", MQ_CERT_LABEL_LENGTH);

  Array a = jscd.Get("HdrCompList").As<Array>();
  for (i = 0; i < 2; i++) {
    Value v = a[i];
    // Object o = v.As<Object>();
    pmqcd->HdrCompList[i] = v.As<Number>().Int32Value();
  }
  a = jscd.Get("MsgCompList").As<Array>();
  for (i = 0; i < 16; i++) {
    Value v = a[i];
    pmqcd->MsgCompList[i] = v.As<Number>().Int32Value();
  }

  return;
};

/*
All of the parameters in the MQCD are input only.
*/
void copyCDfromC(Env env, Object jscd, PMQCD pmqcd) { return; };

void cleanupCD(PMQCD pmqcd) {
  if (pmqcd)
    mqnFree(pmqcd->SSLPeerNamePtr);
}
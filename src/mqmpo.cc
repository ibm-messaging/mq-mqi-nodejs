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

#define VERB "SETMP"
Object SETMP(const CallbackInfo &info) {
  Env env = info.Env();
  enum { IDX_SETMP_HCONN = 0, IDX_SETMP_HMSG, IDX_SETMP_SMPO, IDX_SETMP_NAME, IDX_SETMP_PD, IDX_SETMP_VALUE };

  MQHCONN hConn;
  MQSMPO smpo = {MQSMPO_DEFAULT};
  MQPD pd = {MQPD_DEFAULT};
  MQLONG type = MQTYPE_AS_SET;

  Object jssmpo;
  Object jspd;

  MQLONG CC = MQCC_OK;
  MQLONG RC;
  MQHMSG hMsg;
  MQCHARV name = {MQCHARV_DEFAULT};
  bool b;

  void *valuePtr = NULL;
  int32_t valueInt;
  int len;

  if (info.Length() < 1 || info.Length() > IDX_SETMP_VALUE + 1) {
    throwTE(env, VERB, "Wrong number of arguments");
  }

  hConn = info[IDX_SETMP_HCONN].As<Number>().Int32Value();
  hMsg = info[IDX_SETMP_HMSG].As<BigInt>().Int64Value(&b);

  jssmpo = info[IDX_SETMP_SMPO].As<Object>();
  smpo.Options = getMQLong(jssmpo,"Options"); // Only item to copy over

  jspd = info[IDX_SETMP_PD].As<Object>();
  pd.Options = getMQLong(jspd,"Options");
  pd.CopyOptions = getMQLong(jspd,"CopyOptions");
  pd.Support = getMQLong(jspd,"Support");
  pd.Context = getMQLong(jspd,"Context");

  name.VSPtr = mqnStrdup(env,info[IDX_SETMP_NAME].As<String>().Utf8Value().c_str());
  name.VSLength = strlen((char *)name.VSPtr);



  // TODO: Handle all the possible MQTYPE values including FLOAT and
  //       different sized ints
 
  if (info[IDX_SETMP_VALUE].IsString()) {
    valuePtr = mqnStrdup(env,info[IDX_SETMP_VALUE].As<String>().Utf8Value().c_str());
    len = strlen((char *)valuePtr);
    type = MQTYPE_STRING;
  } else if (info[IDX_SETMP_VALUE].IsNumber()) {
    valueInt = info[IDX_SETMP_VALUE].As<Number>().Int32Value();
    valuePtr = (void *)&valueInt;
    len = sizeof(valueInt);
    type = MQTYPE_INT32;
  } else if (info[IDX_SETMP_VALUE].IsBoolean()) {
    valueInt = info[IDX_SETMP_VALUE].As<Boolean>().Value() ? 1 : 0;
    valuePtr = (void *)&valueInt;
    len = sizeof(valueInt);
    type = MQTYPE_BOOLEAN;
  } else if (info[IDX_SETMP_VALUE].IsBuffer()) {
    valuePtr = info[IDX_SETMP_VALUE].As<Buffer<unsigned char>>().Data();
    len = info[IDX_SETMP_VALUE].As<Buffer<unsigned char>>().Length();
    type = MQTYPE_BYTE_STRING;
 } else if (info[IDX_SETMP_VALUE].IsNull() || info[IDX_SETMP_VALUE].IsUndefined()) {
    valuePtr = NULL;
    len = 0;
    type = MQTYPE_NULL;
  } else {
    debugf(LOG_DEBUG,"V type %d unknown",info[IDX_SETMP_VALUE].Type());
    CC = MQCC_FAILED;
    RC = MQRC_PROPERTY_TYPE_ERROR;
  }

  if (CC == MQCC_OK) {
    CALLMQI("MQSETMP",MQHCONN,MQHMSG,PMQSMPO,PMQCHARV,PMQPD,MQLONG,MQLONG,PMQVOID,PMQLONG,PMQLONG)
                      (hConn, hMsg, &smpo, &name, &pd, type, len, valuePtr, &CC, &RC);
  }

  Object result = Object::New(env);
  result.Set("jsCc", Number::New(env, CC));
  result.Set("jsRc", Number::New(env, RC));

  if (type == MQTYPE_STRING) {
    mqnFree(valuePtr);
  }
  mqnFree(name.VSPtr);

  return result;
}
#undef VERB

#define VERB "DLTMP"
Object DLTMP(const CallbackInfo &info) {
  Env env = info.Env();
  enum { IDX_DLTMP_HCONN = 0, IDX_DLTMP_HMSG, IDX_DLTMP_DMPO, IDX_DLTMP_NAME };

  MQHCONN hConn;
  MQDMPO dmpo = {MQDMPO_DEFAULT};
  MQHMSG hMsg;
  Object jsDmpo;
  MQLONG CC;
  MQLONG RC;
  String propertyName;
  bool b;

  if (info.Length() < 1 || info.Length() > IDX_DLTMP_NAME + 1) {
    throwTE(env, VERB, "Wrong number of arguments");
  }

  hConn = info[IDX_DLTMP_HCONN].As<Number>().Int32Value();
  jsDmpo = info[IDX_DLTMP_DMPO].As<Object>();
  dmpo.Options = jsDmpo.Get("Options").As<Number>().Int32Value(); // Only item to copy over
  hMsg = info[IDX_DLTMP_HMSG].As<BigInt>().Int64Value(&b);

  CALLMQI("MQDLTMP",MQHCONN,PMQHMSG,PMQDMPO,PMQLONG,PMQLONG)(hConn, &hMsg, &dmpo, &CC, &RC);

  Object result = Object::New(env);
  result.Set("jsCc", Number::New(env, CC));
  result.Set("jsRc", Number::New(env, RC));

  return result;
}
#undef VERB

#define VERB "INQMP"
Object INQMP(const CallbackInfo &info) {
  Env env = info.Env();
  enum { IDX_INQMP_HCONN = 0, IDX_INQMP_HMSG, IDX_INQMP_IMPO, IDX_INQMP_NAME, IDX_INQMP_PD, IDX_INQMP_BUFFER };

  MQHCONN hConn;
  MQIMPO impo = {MQIMPO_DEFAULT};
  MQPD pd = {MQPD_DEFAULT};
  MQHMSG hMsg;
  MQCHARV name;
  MQLONG type;

  PMQVOID buf;
  MQLONG buflen;
  MQLONG datalen;

  Object jsimpo;
  Object jspd;

  MQLONG CC = 0;
  MQLONG RC = 0;

  bool b;

  if (info.Length() < 1 || info.Length() > IDX_INQMP_BUFFER + 1) {
    throwTE(env, VERB, "Wrong number of arguments");
  }

  hConn = info[IDX_INQMP_HCONN].As<Number>().Int32Value();
  hMsg = info[IDX_INQMP_HMSG].As<BigInt>().Int64Value(&b);

  jsimpo = info[IDX_INQMP_IMPO].As<Object>();
  impo.Options = getMQLong(jsimpo,"Options"); // Only item to copy over

  // Make sure there's space for the name of the property when it's
  // returned. 1024 ought to be big enough for anyone for now.
  impo.ReturnedName.VSPtr = (char *) mqnAlloc(env,1024);
  impo.ReturnedName.VSBufSize = 1024;
  impo.ReturnedName.VSCCSID = MQCCSI_APPL;
  
  jspd = info[IDX_INQMP_PD].As<Object>();
  pd.Options = getMQLong(jspd,"Options");
  pd.CopyOptions = getMQLong(jspd,"CopyOptions");
  pd.Support = getMQLong(jspd,"Support");
  pd.Context = getMQLong(jspd,"Context");

  name.VSPtr = mqnStrdup(env,info[IDX_INQMP_NAME].As<String>().Utf8Value().c_str());
  name.VSLength = strlen((char *)name.VSPtr);
  name.VSCCSID = MQCCSI_APPL;

  buf = info[IDX_INQMP_BUFFER].As<Buffer<unsigned char>>().Data();
  buflen = info[IDX_INQMP_BUFFER].As<Buffer<unsigned char>>().Length();

  CALLMQI("MQINQMP",MQHCONN,MQHMSG,PMQIMPO,PMQCHARV,PMQPD,PMQLONG,MQLONG,PMQVOID,PMQLONG,PMQLONG,PMQLONG)
    (hConn, hMsg, &impo, &name, &pd, &type, buflen, buf, &datalen, &CC, &RC);

  Object result = Object::New(env);
  result.Set("jsCc", Number::New(env, CC));
  result.Set("jsRc", Number::New(env, RC));

  if (CC == MQCC_OK) {
    result.Set("Type", Number::New(env, type)); 
    result.Set("PropsLen", Number::New(env,datalen));

    jsimpo.Set("ReturnedName", getMQICharV(env,&impo.ReturnedName,true));

  }

  /* Free any spaces that we malloced during this call */
  mqnFree(name.VSPtr);
  return result;
}
#undef VERB

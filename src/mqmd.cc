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

/* Conversion routines for the MQMD if passed from the upper layer as a JS object */
/* More likely to be sent as a Buffer, so these routines may not be needed        */

void copyMDtoC(Env env, Object jsmd, PMQMD pmqmd) {

  pmqmd->Version  = MQMD_VERSION_2;
  pmqmd->Report   = getMQLong(jsmd,"Report");
  pmqmd->MsgType  = getMQLong(jsmd,"MsgType");
  pmqmd->Expiry   = getMQLong(jsmd,"Expiry");
  pmqmd->Feedback = getMQLong(jsmd,"Feedback");
  pmqmd->Encoding = getMQLong(jsmd,"Encoding");
  pmqmd->CodedCharSetId = getMQLong(jsmd,"CodedCharSetId");
  setMQIString(env,pmqmd->Format, jsmd,"Format", MQ_FORMAT_LENGTH);
  
  pmqmd->Priority = getMQLong(jsmd,"Priority");
  pmqmd->Persistence = getMQLong(jsmd,"Persistence");

  setMQIBytes(env,pmqmd->MsgId,jsmd,"MsgId",MQ_MSG_ID_LENGTH);
  setMQIBytes(env,pmqmd->CorrelId,jsmd,"CorrelId",MQ_CORREL_ID_LENGTH);
  
  pmqmd->BackoutCount = getMQLong(jsmd,"BackoutCount");

  setMQIString(env,pmqmd->ReplyToQ , jsmd,"ReplyToQ",MQ_Q_NAME_LENGTH);
  setMQIString(env,pmqmd->ReplyToQMgr, jsmd,"ReplyToQMgr", MQ_Q_MGR_NAME_LENGTH);

  setMQIString(env, pmqmd->UserIdentifier, jsmd, "UserIdentifier", MQ_USER_ID_LENGTH);
  setMQIBytes(env,pmqmd->AccountingToken,jsmd,"AccountingToken",MQ_ACCOUNTING_TOKEN_LENGTH);
  
  setMQIString(env,pmqmd->ApplIdentityData, jsmd,"ApplIdentityData", MQ_APPL_IDENTITY_DATA_LENGTH);
  pmqmd->PutApplType = getMQLong(jsmd,"PutApplType");
  setMQIString(env,pmqmd->PutApplName, jsmd, "PutApplName", MQ_PUT_APPL_NAME_LENGTH);
  setMQIString(env,pmqmd->PutDate, jsmd, "PutDate", MQ_PUT_DATE_LENGTH);
  setMQIString(env,pmqmd->PutTime, jsmd, "PutTime", MQ_PUT_TIME_LENGTH);
  setMQIString(env,pmqmd->ApplOriginData, jsmd, "ApplOriginData", MQ_APPL_ORIGIN_DATA_LENGTH);

  setMQIBytes(env,pmqmd->GroupId,jsmd,"GroupId",MQ_GROUP_ID_LENGTH);

  pmqmd->MsgSeqNumber = getMQLong(jsmd,"MsgSeqNumber");
  pmqmd->Offset       = getMQLong(jsmd,"Offset");
  pmqmd->MsgFlags     = getMQLong(jsmd,"MsgFlags");
  pmqmd->OriginalLength = getMQLong(jsmd,"OriginalLength");
} 

void copyMDfromC(Env env, Object jsmd, PMQMD pmqmd) {

  jsmd.Set("Report", Number::New(env,pmqmd->Report));
  jsmd.Set("MsgType",Number::New(env,pmqmd->MsgType));
  jsmd.Set("Expiry", Number::New(env,pmqmd->Expiry));
  jsmd.Set("Feedback", Number::New(env,pmqmd->Feedback));
  jsmd.Set("Encoding", Number::New(env,pmqmd->Encoding));
  jsmd.Set("CodedCharSetId", Number::New(env,pmqmd->CodedCharSetId));
  jsmd.Set("Format", getMQIString(env,pmqmd->Format, MQ_FORMAT_LENGTH));
  jsmd.Set("Priority", Number::New(env,pmqmd->Priority));
  jsmd.Set("Persistence", Number::New(env,pmqmd->Persistence));

  getMQIBytes(env,pmqmd->MsgId,jsmd,"MsgId",MQ_MSG_ID_LENGTH);
  getMQIBytes(env,pmqmd->CorrelId,jsmd,"CorrelId",MQ_CORREL_ID_LENGTH);
    
  jsmd.Set("BackoutCount", Number::New(env,pmqmd->BackoutCount));

  jsmd.Set("ReplyToQ",getMQIString(env,pmqmd->ReplyToQ, MQ_Q_NAME_LENGTH));
  jsmd.Set("ReplyToQMgr",getMQIString(env,pmqmd->ReplyToQMgr, MQ_Q_MGR_NAME_LENGTH));

  jsmd.Set("UserIdentifier", getMQIString(env,pmqmd->UserIdentifier,MQ_USER_ID_LENGTH));

  getMQIBytes(env,pmqmd->AccountingToken,jsmd,"AccountingToken",MQ_ACCOUNTING_TOKEN_LENGTH);
 
  jsmd.Set("ApplIdentityData", getMQIString(env,pmqmd->ApplIdentityData,MQ_APPL_IDENTITY_DATA_LENGTH));
  jsmd.Set("PutApplType", Number::New(env,pmqmd->PutApplType));
  jsmd.Set("PutApplName", getMQIString(env,pmqmd->PutApplName, MQ_PUT_APPL_NAME_LENGTH));
  jsmd.Set("PutDate"    , getMQIString(env,pmqmd->PutDate, MQ_PUT_DATE_LENGTH));
  jsmd.Set("PutTime"    , getMQIString(env,pmqmd->PutTime, MQ_PUT_TIME_LENGTH));
  jsmd.Set("ApplOriginData", getMQIString(env,pmqmd->ApplOriginData,MQ_APPL_ORIGIN_DATA_LENGTH));

  getMQIBytes(env,pmqmd->GroupId,jsmd,"GroupId",MQ_GROUP_ID_LENGTH);

  jsmd.Set("MsgSeqNumber", Number::New(env,pmqmd->MsgSeqNumber));
  jsmd.Set("Offset", Number::New(env,pmqmd->Offset));
  jsmd.Set("MsgFlags", Number::New(env,pmqmd->MsgFlags));
  jsmd.Set("OriginalLength", Number::New(env,pmqmd->OriginalLength));

  return;
}
'use strict';
/*
  Copyright (c) IBM Corporation 2017

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific

   Contributors:
     Mark Taylor - Initial Contribution
*/

/*
 * MQMD is a JavaScript object containing the fields we need for the MQOD
 * in a more idiomatic style than the C definition - in particular for
 * fixed length character buffers.
 */
var ref        = require('ref');
var StructType = require('ref-struct');
var ArrayType  = require('ref-array');

var MQC        = require('./mqidefs.js');
var MQT        = require('./mqitypes.js');
var u          = require('./mqiutils.js');

/*
 * This constructor sets all the common fields for the structure.
 */
exports.MQMD  = function() {
   this.Report         = MQC.MQRO_NONE;
   this.MsgType        = MQC.MQMT_DATAGRAM;
   this.Expiry         = MQC.MQEI_UNLIMITED;
   this.Feedback       = MQC.MQFB_NONE;
   this.Encoding       = MQC.MQENC_NATIVE;
   this.CodedCharSetId = MQC.MQCCSI_Q_MGR;
   this.Format         = Buffer.alloc(MQC.MQ_FORMAT_LENGTH, ' ');
   this.Priority       = MQC.MQPRI_PRIORITY_AS_Q_DEF;
   this.Persistence    = MQC.MQPER_PERSISTENCE_AS_Q_DEF;
   this.MsgId          = Buffer.alloc(MQC.MQ_MSG_ID_LENGTH,0);
   this.CorrelId       = Buffer.alloc(MQC.MQ_CORREL_ID_LENGTH,0);
   this.BackoutCount   = 0;
   this.ReplyToQ       = null;
   this.ReplyToQMgr    = null;
   this.UserIdentifier = null;
   this.AccountingToken = Buffer.alloc(MQC.MQ_ACCOUNTING_TOKEN_LENGTH,0);
   this.ApplIdentityData = null;
   this.PutApplType     = MQC.MQAT_NO_CONTEXT;
   this.PutApplName     = null;
   this.PutDate         = null;
   this.PutTime         = null;
   this.ApplOriginData  = null;
   this.GroupId         = Buffer.alloc(MQC.MQ_GROUP_ID_LENGTH,0);
   this.MsgSeqNumber    = 1;
   this.Offset          = 0;
   this.MsgFlags        = MQC.MQMF_NONE;
   this.OriginalLength  = MQC.MQOL_UNDEFINED;
   Object.seal(this);
};


/*
 * _MQMDffi_t is the definition directly matching the C structure
 * for the MQMD so it can be used in the FFI call to the MQI.
 * This is not meant to be used publicly.
 */
var _MQMDffi_t = StructType({
  StrucId           : MQT.CHAR4 ,
  Version           : MQT.LONG  ,
  Report            : MQT.LONG  ,
  MsgType           : MQT.LONG  ,
  Expiry            : MQT.LONG  ,
  Feedback          : MQT.LONG  ,
  Encoding          : MQT.LONG  ,
  CodedCharSetId    : MQT.LONG  ,
  Format            : MQT.CHAR8 ,
  Priority          : MQT.LONG  ,
  Persistence       : MQT.LONG  ,
  MsgId             : MQT.BYTE24,
  CorrelId          : MQT.BYTE24,
  BackoutCount      : MQT.LONG  ,
  ReplyToQ          : MQT.CHAR48,
  ReplyToQMgr       : MQT.CHAR48,
  UserIdentifier    : MQT.CHAR12,
  AccountingToken   : MQT.BYTE32,
  ApplIdentityData  : MQT.CHAR32,
  PutApplType       : MQT.LONG  ,
  PutApplName       : MQT.CHAR28,
  PutDate           : MQT.CHAR8 ,
  PutTime           : MQT.CHAR8 ,
  ApplOriginData    : MQT.CHAR4 ,
  GroupId           : MQT.BYTE24,
  MsgSeqNumber      : MQT.LONG  ,
  Offset            : MQT.LONG  ,
  MsgFlags          : MQT.LONG  ,
  OriginalLength    : MQT.LONG
});
exports._MQMDffi_t = _MQMDffi_t;

/*
 * This function creates the C structure analogue, and
 * also populates it with the default values.
 */
exports._newMQMDffi = function() {
  var md = new _MQMDffi_t();

  u.setMQIString(md.StrucId,"MD  ");
  md.Version        = 2; // We will always work with this version
  md.Report         = MQC.MQRO_NONE;
  md.MsgType        = MQC.MQMT_DATAGRAM;
  md.Expiry         = MQC.MQEI_UNLIMITED;
  md.Feedback       = MQC.MQFB_NONE;
  md.Encoding       = MQC.MQENC_NATIVE;
  md.CodedCharSetId = MQC.MQCCSI_Q_MGR;
  u.setMQIString(md.Format,"");
  md.Priority       = MQC.MQPRI_PRIORITY_AS_Q_DEF;
  md.Persistence    = MQC.MQPER_PERSISTENCE_AS_Q_DEF;
  u.fillMQIString(md.MsgId,0);
  u.fillMQIString(md.CorrelId,0);
  md.BackoutCount   = 0;
  u.setMQIString(md.ReplyToQ       , "");
  u.setMQIString(md.ReplyToQMgr    , "");
  u.setMQIString(md.UserIdentifier , "") ;
  u.fillMQIString(md.AccountingToken,0);
  u.setMQIString(md.ApplIdentityData , "");
  md.PutApplType     = MQC.MQAT_NO_CONTEXT;
  u.setMQIString(md.PutApplName     , "");
  u.setMQIString(md.PutDate         , "");
  u.setMQIString(md.PutTime         , "");
  u.setMQIString(md.ApplOriginData  , "");
  u.fillMQIString(md.GroupId,0);
  md.MsgSeqNumber    = 1;
  md.Offset          = 0;
  md.MsgFlags        = MQC.MQMF_NONE;
  md.OriginalLength  = MQC.MQOL_UNDEFINED;

  return md;
};

/*
 * Create a new C MQMD structure and fill it in from the
 * user-supplied JS version of the MQMD
 */
exports._copyMDtoC = function(jsmd) {

  var mqmd = exports._newMQMDffi();
  var i;
  mqmd.Report   = jsmd.Report;
  mqmd.MsgType  = jsmd.MsgType;
  mqmd.Expiry   = jsmd.Expiry;
  mqmd.Feedback = jsmd.Feedback;
  mqmd.Encoding = jsmd.Encoding;
  mqmd.CodedCharSetId = jsmd.CodedCharSetId;
  u.setMQIString(mqmd.Format, jsmd.Format);
  mqmd.Priority = jsmd.Priority;
  mqmd.Persistence = jsmd.Persistence;

  for (i = 0; i < MQC.MQ_MSG_ID_LENGTH; i++) {
    mqmd.MsgId[i] = jsmd.MsgId[i];
  }
  for (i = 0; i < MQC.MQ_CORREL_ID_LENGTH; i++) {
    mqmd.CorrelId[i] = jsmd.CorrelId[i];
  }
  mqmd.BackoutCount = jsmd.BackoutCount;

  u.setMQIString(mqmd.ReplyToQ , jsmd.ReplyToQ);
  u.setMQIString(mqmd.ReplyToQMgr, jsmd.ReplyToQMgr);

  u.setMQIString(mqmd.UserIdentifier, jsmd.UserIdentifier);
  for (i = 0; i < MQC.MQ_ACCOUNTING_TOKEN_LENGTH; i++) {
     mqmd.AccountingToken[i] = jsmd.AccountingToken[i];
  }
  u.setMQIString(mqmd.ApplIdentityData, jsmd.ApplIdentityData);
  mqmd.PutApplType = jsmd.PutApplType;
  u.setMQIString(mqmd.PutApplName, jsmd.PutApplName);
  u.setMQIString(mqmd.PutDate, jsmd.PutDate);
  u.setMQIString(mqmd.PutTime, jsmd.PutTime);
  u.setMQIString(mqmd.ApplOriginData, jsmd.ApplOriginData);

  for (i = 0; i < MQC.MQ_GROUP_ID_LENGTH; i++) {
    mqmd.GroupId[i] = jsmd.GroupId[i];
  }

  mqmd.MsgSeqNumber = jsmd.MsgSeqNumber;
  mqmd.Offset       = jsmd.Offset;
  mqmd.MsgFlags     = jsmd.MsgFlags;
  mqmd.OriginalLength = jsmd.OriginalLength;

  return mqmd;
};

/*
 * Update the JS MQMD from any fields returned in the
 * C MQMD after the put or get
 */
exports._copyMDfromC = function(mqmd, jsmd) {
  var i;
  jsmd.Report      = mqmd.Report;
  jsmd.MsgType     = mqmd.MsgType;
  jsmd.Expiry      = mqmd.Expiry;
  jsmd.Feedback    = mqmd.Feedback;
  jsmd.Encoding    = mqmd.Encoding;
  jsmd.CodedCharSetId = mqmd.CodedCharSetId;
  jsmd.Format      = u.getMQIString(mqmd.Format);
  jsmd.Priority    = mqmd.Priority;
  jsmd.Persistence = mqmd.Persistence;

  for (i = 0; i < MQC.MQ_MSG_ID_LENGTH; i++) {
    jsmd.MsgId[i] = mqmd.MsgId[i];
  }
  for (i = 0; i < MQC.MQ_CORREL_ID_LENGTH; i++) {
    jsmd.CorrelId[i] = mqmd.CorrelId[i];
  }
  jsmd.BackoutCount = mqmd.BackoutCount;

  jsmd.ReplyToQ    = u.getMQIString(mqmd.ReplyToQ);
  jsmd.ReplyToQMgr = u.getMQIString(mqmd.ReplyToQMgr);

  jsmd.UserIdentifier = u.getMQIString(mqmd.UserIdentifier);
  for (i = 0; i < MQC.MQ_ACCOUNTING_TOKEN_LENGTH; i++) {
    jsmd.AccountingToken[i] = mqmd.AccountingToken[i];
  }
  jsmd.ApplIdentityData = u.getMQIString(mqmd.ApplIdentityData);
  jsmd.PutApplType     = mqmd.PutApplType;
  jsmd.PutApplName     = u.getMQIString(mqmd.PutApplName);
  jsmd.PutDate         = u.getMQIString(mqmd.PutDate);
  jsmd.PutTime         = u.getMQIString(mqmd.PutTime);
  jsmd.ApplOriginData  = u.getMQIString(mqmd.ApplOriginData);

  for (i = 0; i < MQC.MQ_GROUP_ID_LENGTH; i++) {
    jsmd.GroupId[i] = mqmd.GroupId[i];
  }
  jsmd.MsgSeqNumber    = mqmd.MsgSeqNumber;
  jsmd.Offset          = mqmd.Offset;
  jsmd.MsgFlags        = mqmd.MsgFlags;
  jsmd.OriginalLength  = mqmd.OriginalLength;

  return;
};

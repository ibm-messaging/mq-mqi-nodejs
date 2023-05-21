'use strict';
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

/*
 * MQMD is a JavaScript object containing the fields we need for the MQMD
 * in a more idiomatic style than the C definition - in particular for
 * fixed length character buffers.
 */
const MQC        = require('./mqidefs.js');

const t = require('./mqitypes.js');
const b = require('./mqibufs.js');

const log = require('./mqilogger.js');

/**
 * This constructor sets default values for the object.
 * @class
 * @classdesc
 * This is a class containing the fields needed for the MQMD
 * (MQ Message Descriptor) structure. See the
 * {@link https://www.ibm.com/support/knowledgecenter/en/SSFKSJ_latest/com.ibm.mq.ref.dev.doc/q097390_.htm|MQ Knowledge Center}
 * for more details on the usage of each field.
 * Not all of the underlying fields may be exposed in this object.
 */
exports.MQMD  = function() {
  /** @member {number} */
   this.Report         = MQC.MQRO_NONE;
  /** @member {number} */
   this.MsgType        = MQC.MQMT_DATAGRAM;
  /** @member {number} */
   this.Expiry         = MQC.MQEI_UNLIMITED;
  /** @member {number} */
   this.Feedback       = MQC.MQFB_NONE;
  /** @member {number} */
   this.Encoding       = MQC.MQENC_NATIVE;
  /** @member {number} */
   this.CodedCharSetId = MQC.MQCCSI_Q_MGR;
  /** @member {Buffer} */
   this.Format         = null;                 
  /** @member {number} */
   this.Priority       = MQC.MQPRI_PRIORITY_AS_Q_DEF;
  /** @member {number} */
   this.Persistence    = MQC.MQPER_PERSISTENCE_AS_Q_DEF;
  /** @member {Buffer} */
   this.MsgId          = Buffer.alloc(MQC.MQ_MSG_ID_LENGTH,0);
  /** @member {Buffer} */
   this.CorrelId       = Buffer.alloc(MQC.MQ_CORREL_ID_LENGTH,0);
  /** @member {number} */
   this.BackoutCount   = 0;
  /** @member {String} */
   this.ReplyToQ       = null;
  /** @member {String} */
   this.ReplyToQMgr    = null;
  /** @member {String} */
   this.UserIdentifier = null;
  /** @member {Buffer} */
   this.AccountingToken = Buffer.alloc(MQC.MQ_ACCOUNTING_TOKEN_LENGTH,0);
  /** @member {String} */
   this.ApplIdentityData = null;
  /** @member {number} */
   this.PutApplType     = MQC.MQAT_NO_CONTEXT;
  /** @member {String} */
   this.PutApplName     = null;
  /** @member {String} */
   this.PutDate         = null;
  /** @member {String} */
   this.PutTime         = null;
  /** @member {String} */
   this.ApplOriginData  = null;
  /** @member {Buffer} */
   this.GroupId         = Buffer.alloc(MQC.MQ_GROUP_ID_LENGTH,0);
  /** @member {number} */
   this.MsgSeqNumber    = 1;
  /** @member {number} */
   this.Offset          = 0;
  /** @member {number} */
   this.MsgFlags        = MQC.MQMF_NONE;
  /** @member {number} */
   this.OriginalLength  = MQC.MQOL_UNDEFINED;
   Object.seal(this);
};

var mdOffsets = {};
var md_default = Buffer.alloc(MQC.MQMD_LENGTH_2);

function createDefaultMDBuf() {
  var md = md_default;
  var o = {offset: 0} ;
  var i;
  b.bufNewWriteString(md, mdOffsets, "StrucId", "MD  ", 4, o);
  b.bufNewWriteInt32(md, mdOffsets, "Version", MQC.MQMD_VERSION_2, o);

  b.bufNewWriteInt32(md, mdOffsets, "Report", MQC.MQRO_NONE, o);
  b.bufNewWriteInt32(md, mdOffsets, "MsgType", MQC.MQMT_DATAGRAM, o);
  b.bufNewWriteInt32(md, mdOffsets, "Expiry", MQC.MQEI_UNLIMITED, o);
  b.bufNewWriteInt32(md, mdOffsets, "Feedback", MQC.MQFB_NONE, o);
  b.bufNewWriteInt32(md, mdOffsets, "Encoding", MQC.MQENC_NATIVE, o);
  b.bufNewWriteInt32(md, mdOffsets, "CodedCharSetId", MQC.MQCCSI_Q_MGR, o);
  b.bufNewWriteString(md, mdOffsets, "Format", "", MQC.MQ_FORMAT_LENGTH, o);
  b.bufNewWriteInt32(md, mdOffsets, "Priority", MQC.MQPRI_PRIORITY_AS_Q_DEF, o);
  b.bufNewWriteInt32(md, mdOffsets, "Persistence", MQC.MQPER_PERSISTENCE_AS_Q_DEF, o);
  b.bufNewFill(md, mdOffsets, "MsgId", 0, MQC.MQ_MSG_ID_LENGTH, o);
  b.bufNewFill(md, mdOffsets, "CorrelId", 0, MQC.MQ_CORREL_ID_LENGTH, o);
  b.bufNewWriteInt32(md, mdOffsets, "BackoutCount", 0, o);
  b.bufNewWriteString(md, mdOffsets, "ReplyToQ", "", MQC.MQ_Q_NAME_LENGTH, o);
  b.bufNewWriteString(md, mdOffsets, "ReplyToQMgr", "", MQC.MQ_Q_MGR_NAME_LENGTH, o);
  b.bufNewWriteString(md, mdOffsets, "UserIdentifier", "", MQC.MQ_USER_ID_LENGTH, o);
  b.bufNewFill(md, mdOffsets, "AccountingToken", 0, MQC.MQ_ACCOUNTING_TOKEN_LENGTH, o);
  b.bufNewWriteString(md, mdOffsets, "ApplIdentityData", "", MQC.MQ_APPL_IDENTITY_DATA_LENGTH, o);
  b.bufNewWriteInt32(md, mdOffsets, "PutApplType", MQC.MQAT_NO_CONTEXT, o);
  b.bufNewWriteString(md, mdOffsets, "PutApplName", "", MQC.MQ_APPL_NAME_LENGTH, o);
  b.bufNewWriteString(md, mdOffsets, "PutDate", "", MQC.MQ_PUT_DATE_LENGTH, o);
  b.bufNewWriteString(md, mdOffsets, "PutTime", "", MQC.MQ_PUT_TIME_LENGTH, o);
  b.bufNewWriteString(md, mdOffsets, "ApplOriginData", "", MQC.MQ_APPL_ORIGIN_DATA_LENGTH, o);
  b.bufNewFill(md, mdOffsets, "GroupId", 0, MQC.MQ_GROUP_ID_LENGTH, o);
  b.bufNewWriteInt32(md, mdOffsets, "MsgSeqNumber", 1, o);
  b.bufNewWriteInt32(md, mdOffsets, "Offset", 0, o);
  b.bufNewWriteInt32(md, mdOffsets, "MsgFlags", MQC.MQMF_NONE, o);
  b.bufNewWriteInt32(md, mdOffsets, "OriginalLength", MQC.MQOL_UNDEFINED, o);

  if (o.offset != md.length) {
      console.log("Bad length for MQMD - check initial structure fields");
  }
  else {
      //console.log("MD Offsets map = %o\nFinal offset=%d. Should be %d.", mdOffsets, o.offset, MQC.MQMD_LENGTH_2);
  }
  return md;
}

function _newBuf() {
  var b = Buffer.alloc(MQC.MQMD_LENGTH_2);
  md_default.copy(b);
  return b;
}

function _copyMDtoBuf(jsmd, mqmd) {
  var i;

  b.bufWriteInt32(mqmd, t.flagsToNumber('MQRO', jsmd.Report), mdOffsets.Report);
  b.bufWriteInt32(mqmd, jsmd.MsgType, mdOffsets.MsgType);
  b.bufWriteInt32(mqmd, jsmd.Expiry, mdOffsets.Expiry);
  b.bufWriteInt32(mqmd, jsmd.Feedback, mdOffsets.Feedback);
  b.bufWriteInt32(mqmd, jsmd.Encoding, mdOffsets.Encoding);
  b.bufWriteInt32(mqmd, jsmd.CodedCharSetId, mdOffsets.CodedCharSetId);
  b.bufWriteString(mqmd, jsmd.Format, MQC.MQ_FORMAT_LENGTH, mdOffsets.Format);
  b.bufWriteInt32(mqmd, jsmd.Priority, mdOffsets.Priority);
  b.bufWriteInt32(mqmd, jsmd.Persistence, mdOffsets.Persistence);

  for (i = 0; i < MQC.MQ_MSG_ID_LENGTH; i++) {
      mqmd[mdOffsets.MsgId + i] = jsmd.MsgId[i];
  }
  for (i = 0; i < MQC.MQ_CORREL_ID_LENGTH; i++) {
      mqmd[mdOffsets.CorrelId + i] = jsmd.CorrelId[i];
  }
  b.bufWriteInt32(mqmd, jsmd.BackoutCount, mdOffsets.BackoutCount);

  b.bufWriteString(mqmd, jsmd.ReplyToQ, MQC.MQ_Q_NAME_LENGTH, mdOffsets.ReplyToQ);
  b.bufWriteString(mqmd, jsmd.ReplyToQMgr, MQC.MQ_Q_MGR_NAME_LENGTH, mdOffsets.ReplyToQMgr);

  b.bufWriteString(mqmd, jsmd.UserIdentifier, MQC.MQ_USER_ID_LENGTH, mdOffsets.UserIdentifier);
  for (i = 0; i < MQC.MQ_ACCOUNTING_TOKEN_LENGTH; i++) {
      mqmd[mdOffsets.AccountingToken + i] = jsmd.AccountingToken[i];
  }
  b.bufWriteString(mqmd, jsmd.ApplIdentityData, MQC.MQ_APPL_IDENTITY_DATA_LENGTH, mdOffsets.ApplIdentityData);
  b.bufWriteInt32(mqmd, jsmd.PutApplType, mdOffsets.PutApplType);
  b.bufWriteString(mqmd, jsmd.PutApplName, MQC.MQ_APPL_NAME_LENGTH, mdOffsets.PutApplName);
  b.bufWriteString(mqmd, jsmd.PutDate, MQC.MQ_PUT_DATE_LENGTH, mdOffsets.PutDate);
  b.bufWriteString(mqmd, jsmd.PutTime, MQC.MQ_PUT_TIME_LENGTH, mdOffsets.PutTime);
  b.bufWriteString(mqmd, jsmd.ApplOriginData, MQC.MQ_APPL_ORIGIN_DATA_LENGTH, mdOffsets.ApplOriginData);

  for (i = 0; i < MQC.MQ_GROUP_ID_LENGTH; i++) {
      mqmd[mdOffsets.GroupId + i] = jsmd.GroupId[i];
  }

  b.bufWriteInt32(mqmd, jsmd.MsgSeqNumber, mdOffsets.MsgSeqNumber);
  b.bufWriteInt32(mqmd, jsmd.Offset, mdOffsets.Offset);
  b.bufWriteInt32(mqmd, t.flagsToNumber('MQMF', jsmd.MsgFlags), mdOffsets.MsgFlags);
  b.bufWriteInt32(mqmd, jsmd.OriginalLength, mdOffsets.OriginalLength);

  //console.log("Input JSMD: %o",jsmd);
  //console.log("Output  MD: %o",mqmd);
}

function _copyMDfromBuf(jsmd, mqmd) {
  var i;
  jsmd.Report = t.flagsFromNumber('MQRO', jsmd.Report, b.bufReadInt32(mqmd, mdOffsets.Report));
  jsmd.MsgType = b.bufReadInt32(mqmd, mdOffsets.MsgType);
  jsmd.Expiry = b.bufReadInt32(mqmd, mdOffsets.Expiry);
  jsmd.Feedback = b.bufReadInt32(mqmd, mdOffsets.Feedback);
  jsmd.Encoding = b.bufReadInt32(mqmd, mdOffsets.Encoding);
  jsmd.CodedCharSetId = b.bufReadInt32(mqmd, mdOffsets.CodedCharSetId);
  jsmd.Format = b.bufReadString(mqmd, MQC.MQ_FORMAT_LENGTH, mdOffsets.Format);
  jsmd.Priority = b.bufReadInt32(mqmd, mdOffsets.Priority);
  jsmd.Persistence = b.bufReadInt32(mqmd, mdOffsets.Persistence);

  for (i = 0; i < MQC.MQ_MSG_ID_LENGTH; i++) {
      jsmd.MsgId[i] = mqmd[mdOffsets.MsgId + i];
  }
  for (i = 0; i < MQC.MQ_CORREL_ID_LENGTH; i++) {
      jsmd.CorrelId[i] = mqmd[mdOffsets.CorrelId + i];
  }
  jsmd.BackoutCount = b.bufReadInt32(mqmd, mdOffsets.BackoutCount);

  jsmd.ReplyToQ = b.bufReadString(mqmd, MQC.MQ_Q_NAME_LENGTH, mdOffsets.ReplyToQ);
  jsmd.ReplyToQMgr = b.bufReadString(mqmd, MQC.MQ_Q_MGR_NAME_LENGTH, mdOffsets.ReplyToQMgr);

  jsmd.UserIdentifier = b.bufReadString(mqmd, MQC.MQ_USER_ID_LENGTH, mdOffsets.UserIdentifier);
  for (i = 0; i < MQC.MQ_ACCOUNTING_TOKEN_LENGTH; i++) {
      jsmd.AccountingToken[i] = mqmd[mdOffsets.AccountingToken + i];
  }
  jsmd.ApplIdentityData = b.bufReadString(mqmd, MQC.MQ_APPL_IDENTITY_DATA_LENGTH, mdOffsets.ApplIdentityData);
  jsmd.PutApplType = b.bufReadInt32(mqmd, mdOffsets.PutApplType);
  jsmd.PutApplName = b.bufReadString(mqmd, MQC.MQ_PUT_APPL_NAME_LENGTH, mdOffsets.PutApplName);
  jsmd.PutDate = b.bufReadString(mqmd, MQC.MQ_PUT_DATE_LENGTH, mdOffsets.PutDate);
  jsmd.PutTime = b.bufReadString(mqmd, MQC.MQ_PUT_TIME_LENGTH, mdOffsets.PutTime);
  jsmd.ApplOriginData = b.bufReadString(mqmd, MQC.MQ_APPL_ORIGIN_DATA_LENGTH, mdOffsets.ApplOriginData);

  for (i = 0; i < MQC.MQ_GROUP_ID_LENGTH; i++) {
      jsmd.GroupId[i] = mqmd[mdOffsets.GroupId + i];
  }
  jsmd.MsgSeqNumber = b.bufReadInt32(mqmd, mdOffsets.MsgSeqNumber);
  jsmd.Offset = b.bufReadInt32(mqmd, mdOffsets.Offset);
  var flags = b.bufReadInt32(mqmd, mdOffsets.MsgFlags);

  jsmd.MsgFlags = t.flagsFromNumber('MQMF', jsmd.Flags, flags);
  jsmd.OriginalLength = b.bufReadInt32(mqmd, mdOffsets.OriginalLength);
}

createDefaultMDBuf();

exports._newBuf = _newBuf;
exports._copyMDtoBuf = _copyMDtoBuf;
exports._copyMDfromBuf = _copyMDfromBuf;
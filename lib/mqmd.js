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
var MQC        = require('./mqidefs.js');

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
'use strict';
/*
  Copyright (c) IBM Corporation 2017,2023

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
 * MQPMO is a JavaScript object containing the fields we need for the MQPMO
 * in a more idiomatic style than the C definition - in particular for
 * fixed length character buffers.
 */

// Import MQI definitions
var MQC        = require('./mqidefs.js');

const t = require('./mqitypes.js');
const b = require('./mqibufs.js');

const log = require('./mqilogger.js');

/**
 * This constructor sets default values for the object.
 * @class
 * @classdesc
 * This is a class containing the fields needed for the MQPMO
 * (MQ Put Message Options) structure. See the
 * {@link https://www.ibm.com/docs/en/ibm-mq/latest?topic=mqi-mqpmo-put-message-options|MQ Documentation}
 * for more details on the usage of each field.
 * Not all of the underlying fields may be exposed in this object.
 * <p>Note: This sets the FIQ flag by default, which is not standard in the MQI
 * but probably should have been. It's also forced to be set elsewhere.
 */
exports.MQPMO  = function() {
  /** @member {number} */
  this.Options          = MQC.MQPMO_FAIL_IF_QUIESCING;
  /** @member {String} */
  this.Context          = null; // This would be set to an MQObject

  /** @member {String} */
  this.ResolvedQName    = null;
  /** @member {String} */
  this.ResolvedQMgrName = null;

  // This API is not going to support distribution lists - use pub/sub instead.
  // I've left the fields here, but commented out so you can see them.
  //
  // this.KnownDestCount   = 0
  // this.UnknownDestCount = 0
  // this.InvalidDestCount = 0
  // this.RecsPresent = 0
  // this.PutMsgRecFields = 0
  // this.PutMsgRecOffset = 0
  // this.ResponseRecOffset = 0
  // this.PutMsgRecPtr = null
  // this.ResponseRecPtr = null

  /** @member {number} */
  this.OriginalMsgHandle = BigInt(MQC.MQHM_NONE);
  /** @member {number} */
  this.NewMsgHandle      = BigInt(MQC.MQHM_NONE);
  /** @member {number} */
  this.Action            = MQC.MQACTP_NEW;
  /** @member {number} */
  this.PubLevel          = 9;
  Object.seal(this);

};

var pmoOffsets = {};
var pmo_default = Buffer.alloc(MQC.MQPMO_LENGTH_3);

function createDefaultPMOBuf() {
  var pmo = pmo_default;
  var o = {offset: 0} ;
  var i;
  b.bufNewWriteString(pmo, pmoOffsets, "StrucId", "PMO ", 4, o);
  b.bufNewWriteInt32(pmo, pmoOffsets, "Version", MQC.MQPMO_VERSION_3, o);
  b.bufNewWriteInt32(pmo, pmoOffsets, "Options", MQC.MQPMO_NONE, o);
  b.bufNewWriteInt32(pmo, pmoOffsets, "Timeout", -1,o);
  b.bufNewWriteInt32(pmo, pmoOffsets, "Context", 0,o);
  b.bufNewWriteInt32(pmo, pmoOffsets, "KnownDestCount",0,o);
  b.bufNewWriteInt32(pmo, pmoOffsets, "UnknownDestCount",0,o);
  b.bufNewWriteInt32(pmo, pmoOffsets, "InvalidDestCount",0,o);
  b.bufNewWriteString(pmo, pmoOffsets, "ResolvedQName", "", MQC.MQ_Q_NAME_LENGTH, o);
  b.bufNewWriteString(pmo, pmoOffsets, "ResolvedQMgrName", "", MQC.MQ_Q_MGR_NAME_LENGTH, o);
  b.bufNewWriteInt32(pmo, pmoOffsets, "RecsPresent",0,o);
  b.bufNewWriteInt32(pmo, pmoOffsets, "PutMsgRecFields",MQC.MQPMRF_NONE,o);
  b.bufNewWriteInt32(pmo, pmoOffsets, "PutMsgRecOffset",0,o);
  b.bufNewWriteNullPtr(pmo,pmoOffsets,"PutMsgRecPtr",o);
  b.bufNewWriteInt32(pmo,pmoOffsets,"ResponseRecOffset",0,o);
  b.bufNewWriteNullPtr(pmo,pmoOffsets,"ResponseMsgRecPtr",o);

  b.bufNewWriteInt64(pmo, pmoOffsets, "OriginalMsgHandle",MQC.MQHM_NONE,o);
  b.bufNewWriteInt64(pmo, pmoOffsets, "NewMsgHandle",MQC.MQHM_NONE,o);
  b.bufNewWriteInt32(pmo, pmoOffsets, "Action",MQC.MQACTP_NEW,o);
  b.bufNewWriteInt32(pmo, pmoOffsets, "PubLevel",9,o);

  if (o.offset != pmo.length) {
      console.error("Bad length for MQPMO - check initial structure fields");
      console.error("Offsets map = %o Final offset=%d. Should be %d.", pmoOffsets, o.offset, MQC.MQPMO_LENGTH_3);
  }
  return pmo;
}

function _newBuf() {
  var b = Buffer.alloc(MQC.MQPMO_LENGTH_3);
  pmo_default.copy(b);
  return b;
}

function _copyPMOtoBuf(jspmo, mqpmo) {

  b.bufWriteInt32(mqpmo, t.flagsToNumber('MQPMO', jspmo.Options) | MQC.MQPMO_FAIL_IF_QUIESCING, pmoOffsets.Options);
  b.bufWriteInt64(mqpmo, jspmo.OriginalMsgHandle, pmoOffsets.OriginalMsgHandle);
  b.bufWriteInt64(mqpmo, jspmo.NewMsgHandle, pmoOffsets.NewMsgHandle);
  b.bufWriteInt32(mqpmo, jspmo.Action, pmoOffsets.Action);
  b.bufWriteInt32(mqpmo, jspmo.PubLevel, pmoOffsets.PubLevel);

  return;
}

function _copyPMOfromBuf(jspmo, mqpmo) {

  jspmo.Options = t.flagsFromNumber('MQPMO', jspmo.Options, b.bufReadInt32(mqpmo, pmoOffsets.Options));
  jspmo.ResolvedQName = b.bufReadString(mqpmo, MQC.MQ_Q_NAME_LENGTH, pmoOffsets.ResolvedQName);
  jspmo.ResolvedQMgrName = b.bufReadString(mqpmo, MQC.MQ_Q_MGR_NAME_LENGTH, pmoOffsets.ResolvedQMgrName);
  jspmo.OriginalMsgHandle = b.bufReadInt64(mqpmo, pmoOffsets.OriginalMsgHandle);
  jspmo.NewMsgHandle = b.bufReadInt64(mqpmo, pmoOffsets.NewMsgHandle);
  jspmo.PubLevel = b.bufReadInt32(mqpmo, pmoOffsets.PubLevel);
  
  return;
}

createDefaultPMOBuf();

exports._newBuf = _newBuf;
exports._copyPMOtoBuf = _copyPMOtoBuf;
exports._copyPMOfromBuf = _copyPMOfromBuf;

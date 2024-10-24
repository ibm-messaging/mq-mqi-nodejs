"use strict";
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
 * MQGMO is a JavaScript object containing the fields we need for the MQGMO
 * in a more idiomatic style than the C definition - in particular for
 * fixed length character buffers.
 */

// Import MQI definitions
const MQC = require("./mqidefs.js");

const t = require("./mqitypes.js");
const b = require("./mqibufs.js");

// const log = require("./mqilogger.js");

/**
 * This constructor sets default values for the object.
 * @class
 * @classdesc
 * This is a class containing the fields needed for the MQGMO
 * (MQ Get Message Options) structure. See the
 * {@link https://www.ibm.com/docs/en/ibm-mq/latest?topic=mqi-mqgmo-get-message-options|MQ Documentation}
 * for more details on the usage of each field.
 * Not all of the underlying fields may be exposed in this object.
 * <p>Note: This sets the FIQ flag by default, which is not standard in the MQI
 * but probably should have been. It's also forced to be set elsewhere.
 */
exports.MQGMO = function () {
  /** @member {number} */
  this.Options = MQC.MQGMO_NO_WAIT
    | MQC.MQGMO_PROPERTIES_AS_Q_DEF
    | MQC.MQGMO_FAIL_IF_QUIESCING;
  /** @member {number} */
  this.WaitInterval = MQC.MQWI_UNLIMITED;
  /** @member {String} */
  this.ResolvedQName = null;
  /** @member {number} */
  this.MatchOptions = MQC.MQMO_MATCH_MSG_ID | MQC.MQMO_MATCH_CORREL_ID;
  /** @member {char} */
  this.GroupStatus = " ";
  /** @member {char} */
  this.SegmentStatus = " ";
  /** @member {char} */
  this.Segmentation = " ";
  /** @member {Buffer} */
  this.MsgToken = Buffer.alloc(MQC.MQ_MSG_TOKEN_LENGTH, 0);
  /** @member {number} */
  this.ReturnedLength = MQC.MQRL_UNDEFINED;
  /** @member {Object} */
  this.MsgHandle = BigInt(MQC.MQHM_NONE);

  /** @member {Object} */
  this.OtelOpts = {};

  Object.seal(this);
};

const gmoOffsets = {};
const gmo_default = Buffer.alloc(MQC.MQGMO_LENGTH_4);

function createDefaultGMOBuf() {
  const gmo = gmo_default;
  const o = { offset: 0 };

  b.bufNewWriteString(gmo, gmoOffsets, "StrucId", "GMO ", 4, o);
  b.bufNewWriteInt32(gmo, gmoOffsets, "Version", MQC.MQGMO_VERSION_4, o);

  b.bufNewWriteInt32(gmo, gmoOffsets, "Options", MQC.MQGMO_NO_WAIT | MQC.MQGMO_PROPERTIES_AS_Q_DEF, o);
  b.bufNewWriteInt32(gmo, gmoOffsets, "WaitInterval", 0, o);
  b.bufNewWriteInt32(gmo, gmoOffsets, "Signal1", 0, o);
  b.bufNewWriteInt32(gmo, gmoOffsets, "Signal2", 0, o);
  b.bufNewWriteString(gmo, gmoOffsets, "ResolvedQName", "", MQC.MQ_Q_NAME_LENGTH, o);
  b.bufNewWriteInt32(gmo, gmoOffsets, "MatchOptions", MQC.MQMO_MATCH_MSG_ID | MQC.MQMO_MATCH_CORREL_ID, o);
  b.bufNewWriteChar(gmo, gmoOffsets, "GroupStatus", MQC.MQGS_NOT_IN_GROUP, o);
  b.bufNewWriteChar(gmo, gmoOffsets, "SegmentStatus", MQC.MQGS_NOT_A_SEGMENT, o);
  b.bufNewWriteChar(gmo, gmoOffsets, "Segmentation", MQC.MQSEG_INHIBITED, o);
  b.bufNewWriteChar(gmo, gmoOffsets, "Reserved1", " ", o);
  b.bufNewFill(gmo, gmoOffsets, "MsgToken", 0, MQC.MQ_MSG_TOKEN_LENGTH, o);
  b.bufNewWriteInt32(gmo, gmoOffsets, "ReturnedLength", MQC.MQRL_UNDEFINED, o);
  b.bufNewWriteInt32(gmo, gmoOffsets, "Reserved2", 0, o);
  b.bufNewWriteInt64(gmo, gmoOffsets, "MsgHandle", MQC.MQHM_NONE, o);

  if (o.offset != gmo.length) {
    console.error("Bad length for MQGMO - check initial structure fields");
  }
  return gmo;
}

function _newBuf() {
  const buf = Buffer.alloc(MQC.MQGMO_LENGTH_4);
  gmo_default.copy(buf);
  return buf;
}

function _copyGMOtoBuf(jsgmo, mqgmo) {
  let i;

  b.bufWriteInt32(mqgmo, t.flagsToNumber("MQGMO", jsgmo.Options) | MQC.MQGMO_FAIL_IF_QUIESCING, gmoOffsets.Options);
  b.bufWriteInt32(mqgmo, jsgmo.WaitInterval, gmoOffsets.WaitInterval);
  b.bufWriteInt32(mqgmo, t.flagsToNumber("MQMO", jsgmo.MatchOptions), gmoOffsets.MatchOptions);
  b.bufWriteInt64(mqgmo, jsgmo.MsgHandle, gmoOffsets.MsgHandle);

  for (i = 0; i < MQC.MQ_MSG_TOKENLENGTH; i++) {
    mqgmo[gmoOffsets.MsgToken + i] = jsgmo.MsgToken[i];
  }

  return;
}

function _copyGMOfromBuf(jsgmo, mqgmo) {
  let i;

  jsgmo.Options = t.flagsFromNumber("MQGMO", jsgmo.Options, b.bufReadInt32(mqgmo, gmoOffsets.Options));
  jsgmo.WaitInterval = b.bufReadInt32(mqgmo, gmoOffsets.WaitInterval);
  jsgmo.ResolvedQName = b.bufReadString(mqgmo, MQC.MQ_Q_NAME_LENGTH, gmoOffsets.ResolvedQName);

  for (i = 0; i < MQC.MQ_MSG_TOKEN_LENGTH; i++) {
    jsgmo.MsgToken[i] = mqgmo[gmoOffsets.MsgToken + i];
  }

  jsgmo.GroupStatus = b.bufReadChar(mqgmo, gmoOffsets.GroupStatus);
  jsgmo.SegmentStatus = b.bufReadChar(mqgmo, gmoOffsets.SegmentStatus);
  jsgmo.Segmentation = b.bufReadChar(mqgmo, gmoOffsets.Segmentation);

  jsgmo.ReturnedLength = b.bufReadInt32(mqgmo, gmoOffsets.ReturnedLength);
  jsgmo.MsgHandle = b.bufReadInt64(mqgmo, gmoOffsets.MsgHandle);

  return;
}

createDefaultGMOBuf();

exports._newBuf = _newBuf;
exports._copyGMOtoBuf = _copyGMOtoBuf;
exports._copyGMOfromBuf = _copyGMOfromBuf;

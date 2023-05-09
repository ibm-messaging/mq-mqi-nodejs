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
 * MQGMO is a JavaScript object containing the fields we need for the MQGMO
 * in a more idiomatic style than the C definition - in particular for
 * fixed length character buffers.
 */

// Import MQI definitions
var MQC        = require('./mqidefs.js');


/**
 * This constructor sets default values for the object.
 * @class
 * @classdesc
 * This is a class containing the fields needed for the MQGMO
 * (MQ Get Message Options) structure. See the
 * {@link https://www.ibm.com/support/knowledgecenter/en/SSFKSJ_latest/com.ibm.mq.ref.dev.doc/q096710_.htm|MQ Knowledge Center}
 * for more details on the usage of each field.
 * Not all of the underlying fields may be exposed in this object.
 * <p>Note: This sets the FIQ flag by default, which is not standard in the MQI
 * but probably should have been. It's also forced to be set elsewhere.
 */
exports.MQGMO  = function() {
  /** @member {number} */
  this.Options        = MQC.MQGMO_NO_WAIT
                      | MQC.MQGMO_PROPERTIES_AS_Q_DEF
                      | MQC.MQGMO_FAIL_IF_QUIESCING;
  /** @member {number} */
  this.WaitInterval   = MQC.MQWI_UNLIMITED;
  /** @member {String} */
  this.ResolvedQName  = null;
  /** @member {number} */
  this.MatchOptions   = MQC.MQMO_MATCH_MSG_ID | MQC.MQMO_MATCH_CORREL_ID;
  /** @member {char} */
  this.GroupStatus    = ' ';
  /** @member {char} */
  this.SegmentStatus  = ' ';
  /** @member {char} */
  this.Segmentation   = ' ';
  /** @member {Buffer} */
  this.MsgToken       = Buffer.alloc(MQC.MQ_MSG_TOKEN_LENGTH,0);
  /** @member {number} */
  this.ReturnedLength = MQC.MQRL_UNDEFINED;
  /** @member {Object} */
  this.MsgHandle      = BigInt(MQC.MQHM_NONE);
  Object.seal(this);
};

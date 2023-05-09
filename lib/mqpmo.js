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

/**
 * This constructor sets default values for the object.
 * @class
 * @classdesc
 * This is a class containing the fields needed for the MQPMO
 * (MQ Put Message Options) structure. See the
 * {@link https://www.ibm.com/support/knowledgecenter/en/SSFKSJ_latest/com.ibm.mq.ref.dev.doc/q098650_.htm|MQ Knowledge Center}
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

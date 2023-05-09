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
 * MQSD is a JavaScript object containing the fields we need for the MQSD
 * in a more idiomatic style than the C definition - in particular for
 * fixed length character buffers.
 */


// Import MQI definitions
var MQC        = require('./mqidefs.js');

/**
 * This constructor sets default values for the object.
 * @class
 * @classdesc
 * This is a class containing the fields needed for the MQSD
 * (MQ Subscription Descriptor) structure. See the
 * {@link https://www.ibm.com/support/knowledgecenter/en/SSFKSJ_latest/com.ibm.mq.ref.dev.doc/q100010_.htm|MQ Knowledge Center}
 * for more details on the usage of each field.
 * Not all of the underlying fields may be exposed in this object.
 */
exports.MQSD = function() {
  /** @member {number} */
  this.Options        = 0;
  /** @member {String} */
  this.ObjectName     = null;
  /** @member {String} */
  this.AlternateUserId= null;
  /** @member {Buffer} */
  this.AlternateSecurityId = Buffer.alloc(MQC.MQ_SECURITY_ID_LENGTH,0);
  /** @member {number} */
  this.SubExpiry = MQC.MQEI_UNLIMITED;
  /** @member {String} */
  this.ObjectString = null;
  /** @member {String} */
  this.SubName = null;
  /** @member {String} */
  this.SubUserData = null;
  /** @member {Buffer} */
  this.SubCorrelId = Buffer.alloc(MQC.MQ_CORREL_ID_LENGTH);
  /** @member {number} */
  this.PubPriority = MQC.MQPRI_PRIORITY_AS_PUBLISHED;
  /** @member {Buffer} */
  this.PubAccountingToken = Buffer.alloc(MQC.MQ_ACCOUNTING_TOKEN_LENGTH,0);
  /** @member {String} */
  this.PubApplIdentityData = null;

  /** @member {String} */
  this.SelectionString = null;
  /** @member {number} */
  this.SubLevel = 1;
  /** @member {String} */
  this.ResObjectString = null;

  Object.seal(this);
};
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
 * These are JavaScript objects containing the fields we need
 * for the MQCMHO and MQDMHO structures.
 */

// Import MQI definitions
var MQC        = require('./mqidefs.js');

/**
 * This constructor sets default values for the object.
 * @class
 * @classdesc
 * This is a class containing the fields needed for the MQCMHO
 * (MQ Create Message Handle Options) structure. See the
 * {@link https://www.ibm.com/support/knowledgecenter/en/SSFKSJ_latest/com.ibm.mq.ref.dev.doc/q095320_.htm|MQ Knowledge Center}
 * for more details on the usage of each field.
 */
exports.MQCMHO  = function() {
  /** @member {number} */
  this.Options = MQC.MQCMHO_DEFAULT_VALIDATION;
  Object.seal(this);
};

/**
 * This constructor sets default values for the object.
 * @class
 * @classdesc
 * This is a class containing the fields needed for the MQDMHO
 * (MQ Delete Message Handle Options) structure. See the
 * {@link https://www.ibm.com/support/knowledgecenter/en/SSFKSJ_latest/com.ibm.mq.ref.dev.doc/q096320_.htm|MQ Knowledge Center}
 * for more details on the usage of each field.
 */
exports.MQDMHO  = function() {
  /** @member {number} */
  this.Options = MQC.MQDMHO_NONE;
  Object.seal(this);
};

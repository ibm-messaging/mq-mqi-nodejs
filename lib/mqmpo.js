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
 * This is a class containing the fields needed for the MQIMPO
 * (MQ Inquire Message Property Options) structure. See the
 * {@link https://www.ibm.com/docs/en/ibm-mq/latest?topic=mqi-mqimpo-inquire-message-property-options|MQ Documentation}
 * for more details on the usage of each field.
 */
exports.MQIMPO  = function() {
  /** @member {number} */
  this.Options = MQC.MQIMPO_NONE;
  /** @member {String} */
  this.ReturnedName = null;
  /** @member {String} */
  this.TypeString = null;
  /** @member {number} */
  this.ReturnedEncoding = MQC.MQENC_NATIVE;
  /* @member {number} */
  this.ReturnedCCSID = MQC.MQCCSI_APPL;
  Object.seal(this);
};

/**
 * This constructor sets default values for the object.
 * @class
 * @classdesc
 * This is a class containing the fields needed for the MQSMPO
 * (MQ Set Message Property Options) structure. See the
 * {@link https://www.ibm.com/docs/en/ibm-mq/latest?topic=mqi-mqsmpo-set-message-property-options|MQ Documentation}
 * for more details on the usage of each field.
 */
exports.MQSMPO  = function() {
  /** @member {number} */
  this.Options = MQC.MQSMPO_SET_FIRST;
  Object.seal(this);
};

/**
 * This constructor sets default values for the object.
 * @class
 * @classdesc
 * This is a class containing the fields needed for the MQDMPO
 * (MQ Delete Message Property Options) structure. See the
 * {@link https://www.ibm.com/docs/en/ibm-mq/latest?topic=mqi-mqdmpo-delete-message-property-options|MQ Documentation}
 * for more details on the usage of each field.
 */
exports.MQDMPO  = function() {
  /** @member {number} */
  this.Options = MQC.MQDMPO_DEL_FIRST;
  Object.seal(this);
};

/**
 * This constructor sets default values for the object.
 * @class
 * @classdesc
 * This is a class containing the fields needed for the MQPD
 * (MQ Property Descriptor) structure. See the
 * {@link https://www.ibm.com/docs/en/ibm-mq/latest?topic=mqi-mqpd-property-descriptor|MQ Documentation}
 * for more details on the usage of each field.
 */
exports.MQPD  = function() {
  /** @member {number} */
  this.Options = MQC.MQPD_NONE;
  /** @member {number} */
  this.Support = MQC.MQPD_SUPPORT_OPTIONAL;
  /** @member {number} */
  this.Context = MQC.MQPD_NO_CONTEXT;
  /** @member {number} */
  this.CopyOptions = MQC.MQCOPY_DEFAULT;
  Object.seal(this);
};
"use strict";
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
 * MQCNO is a JavaScript object containing the fields we need for the MQCNO
 * in a more idiomatic style than the C definition - in particular for
 * fixed length character buffers.
 */

// Import MQI definitions
const MQC        = require("./mqidefs.js");

/**
 * This constructor sets default values for the object.
 * @class
 * @classdesc
 * This is a class containing the fields needed for the MQCNO
 * (MQ Connection Options) structure. See the
 * {@link https://www.ibm.com/docs/en/ibm-mq/latest?topic=mqi-mqcno-connect-options|MQ Documentation}
 * for more details on the usage of each field.
 * Not all of the underlying fields may be exposed in this object.
 */
exports.MQCNO  = function () {
  /** @member {number} */
  this.Options        = MQC.MQCNO_NONE;
  /** @member {MQCSP} */
  this.SecurityParms  = null;
  /** @member {String} */
  this.CCDTUrl        = null;
  /** @member {MQCD} */
  this.ClientConn     = null;
  /** @member {MQSCO} */
  this.SSLConfig      = null;
  /** @member {string} */
  this.ApplName       = null;
  /** @member {MQBNO} */
  this.BalanceParms   = null;
  Object.seal(this);
};

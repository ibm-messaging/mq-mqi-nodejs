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
 * MQSTS is a JavaScript object containing the fields we need for the MQSTS
 * in a more idiomatic style than the C definition - in particular for
 * fixed length character buffers.
 */

// Import MQI definitions
var MQC        = require('./mqidefs.js');

/*
 * This constructor sets all the common fields for the structure.
 */
/**
 * This constructor sets default values for the object.
 * @class
 * @classdesc
 * This is a class containing the fields needed for the MQSTS
 * (MQ Status reporting) structure. See the
 * {@link https://www.ibm.com/docs/en/ibm-mq/latest?topic=mqi-mqsts-status-reporting-structure|MQ Documentation}
 * for more details on the usage of each field.
 */
exports.MQSTS  = function() {
  /** @member {number} */
  this.CompCode          = MQC.MQCC_OK;
  /** @member {number} */
  this.Reason            = MQC.MQRC_NONE;
  /** @member {number} */
  this.PutSuccessCount   = 0;
  /** @member {number} */
  this.PutWarningCount   = 0;
  /** @member {number} */
  this.PutFailureCount   = 0;

  /** @member {number} */
  this.ObjectType        = MQC.MQOT_Q;
  /** @member {String} */
  this.ObjectName        = null;
  /** @member {String} */
  this.ObjectQMgrName    = null;
  /** @member {String} */
  this.ResolvedObjectName= null;
  /** @member {String} */
  this.ResolvedQMgrName  = null;

  /** @member {String} */
  this.ObjectString      = null;
  /** @member {String} */
  this.SubName           = null;
  /** @member {number} */
  this.OpenOptions       = 0;
  /** @member {number} */
  this.SubOptions        = 0;
  Object.seal(this);
};

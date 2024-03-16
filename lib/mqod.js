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


// Import MQI definitions
const MQC        = require("./mqidefs.js");

/**
 * This constructor sets default values for the object.
 * @class
 * @classdesc
 * This is a class containing the fields needed for the MQOD
 * (MQ Object Descriptor) structure. See the
 * {@link https://www.ibm.com/docs/en/ibm-mq/latest?topic=mqi-mqod-object-descriptor|MQ Documentation}
 * for more details on the usage of each field.
 * Not all of the underlying fields may be exposed in this object.
 */
exports.MQOD = function () {
  /** @member {number} */
  this.ObjectType     = MQC.MQOT_Q;
  /** @member {String} */
  this.ObjectName     = null;
  /** @member {String} */
  this.ObjectQMgrName = null;
  /** @member {String} */
  this.DynamicQName   = "AMQ.*";
  /** @member {String} */
  this.AlternateUserId= null;

/*
Not going to deal with Distribution lists - pub/sub is the recommended way to
work with multiple destinations
  this.RecsPresent = 0;
  this.KnownDestCount = 0;
  this.UnknownDestCount = 0;
  this.InvalidDestCount = 0;
  this.ObjectRecOffset = 0;
  this.ResponseRecOffset = 0;
*/

  /** @member {Buffer} */
  this.AlternateSecurityId = Buffer.alloc(MQC.MQ_SECURITY_ID_LENGTH);
  /** @member {String} */
  this.ResolvedQName = null;
  /** @member {String} */
  this.ResolvedQMgrName = null;

  /** @member {String} */
  this.ObjectString = null;
  /** @member {String} */
  this.SelectionString = null;
  /** @member {String} */
  this.ResObjectString = null;
  /** @member {number} */
  this.ResolvedType = MQC.MQOT_NONE;
  Object.seal(this);
};

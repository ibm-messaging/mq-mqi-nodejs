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
 * MQSRO is a JavaScript object containing the fields we need for the MQSRO
 * in a more idiomatic style than the C definition - in particular for
 * fixed length character buffers.
 */

/*
 * This constructor sets all the common fields for the structure.
 */
/**
 * This constructor sets default values for the object.
 * @class
 * @classdesc
 * This is a class containing the fields needed for the MQSRO
 * (MQ Subscription Request Options) structure. See the
 * {@link https://www.ibm.com/docs/en/ibm-mq/latest?topic=mqi-mqsro-subscription-request-options|MQ Documentation}
 * for more details on the usage of each field.
 */
exports.MQSRO  = function () {
  /** @member {number} */
  this.Options = 0;
  /** @member {number} */
  this.NumPubs = 0;
  Object.seal(this);
};

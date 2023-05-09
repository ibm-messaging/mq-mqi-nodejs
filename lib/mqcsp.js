'use strict';
/*
  Copyright (c) IBM Corporation 2017,2022

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
 * MQCSP is a JavaScript object containing the fields we need for the MQCSP
 * in a more idiomatic style than the C definition - in particular for
 * fixed length character buffers.
 *
 * There is no need for the copyXXXtoC/copyXXXfromC functions in here as that
 * is handled within the MQCNO processing.
 */

// Import packages for handling structures
var MQC        = require('./mqidefs.js');

/**
 * This constructor sets default values for the object.
 * @class
 * @classdesc
 * This is a class containing the fields needed for the MQCSP
 * (MQ Connection Security Parameters) structure. See the
 * {@link https://www.ibm.com/support/knowledgecenter/en/SSFKSJ_latest/com.ibm.mq.ref.dev.doc/q095610_.htm|MQ Knowledge Center}
 * for more details on the usage of each field.
 * Not all of the underlying fields may be exposed in this object. For example,
 * unlike the regular MQI, we don't bother exposing the authenticationType
 * attribute, as there's currently only one value other than none - and setting
 * the userid and password implies you want to use it.
 */
exports.MQCSP  = function() {
  /** @member {String} */
  this.UserId         = null;
  /** @member {String} */
  this.Password       = null;
  this._authenticationType = MQC.MQCSP_AUTH_USER_ID_AND_PWD;
  /** @member {String} */
  this.InitialKey    = null;
  Object.seal(this);
};

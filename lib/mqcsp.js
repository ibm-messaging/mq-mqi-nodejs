'use strict';
/*
  Copyright (c) IBM Corporation 2017,2020

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
var ref        = require('ref-napi');
var StructType = require('ref-struct-di')(ref);
var ArrayType  = require('ref-array-di')(ref);

// Import packages for handling structures
var MQC        = require('./mqidefs.js');
var MQT        = require('./mqitypes.js');
var u          = require('./mqiutils.js');

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
  Object.seal(this);
};

/*
 * _MQCSPffi_t is the definition directly matching the C structure
 * for the MQCSP so it can be used in the FFI call to the MQI.
 * This is not meant to be used publicly.
 */
var _MQCSPffi_t = StructType({
  StrucId           : MQT.CHAR4 ,
  Version           : MQT.LONG  ,
  AuthenticationType: MQT.LONG  ,
  Reserved1         : MQT.BYTE4 ,
  CSPUserIdPtr      : MQT.PTR   ,
  CSPUserIdOffset   : MQT.LONG  ,
  CSPUserIdLength   : MQT.LONG  ,
  Reserved2         : MQT.BYTE8 ,
  CSPPasswordPtr    : MQT.PTR   ,
  CSPPasswordOffset : MQT.LONG  ,
  CSPPasswordLength : MQT.LONG
});

/*
 * This function creates the C structure analogue, and
 * also populates it with the default values.
 */
exports._newMQCSPffi = function() {
  var csp = new _MQCSPffi_t();

  u.setMQIString(csp.StrucId,"CSP ");
  csp.Version        = 1;
  csp.AuthenticationType = MQC.MQCSP_AUTH_NONE;
  u.fillMQIString(csp.Reserved1,0);
  csp.CSPUserIdPtr      = ref.NULL_POINTER;
  csp.CSPUserIdOffset   = 0;
  csp.CSPUserIdLength   = 0;
  u.fillMQIString(csp.Reserved2,0);
  csp.CSPPasswordPtr    = ref.NULL_POINTER;
  csp.CSPPasswordOffset = 0;
  csp.CSPPasswordLength = 0;

  return csp;
};

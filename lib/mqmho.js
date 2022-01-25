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
 * These are JavaScript objects containing the fields we need
 * for the MQCMHO and MQDMHO structures.
 */

// Import packages for handling structures
var ref        = require('ref-napi');
var StructType = require('ref-struct-di')(ref);
var ArrayType  = require('ref-array-di')(ref);

// Import MQI definitions
var MQC        = require('./mqidefs.js');
var MQT        = require('./mqitypes.js');
var u          = require('./mqiutils.js');

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

/*
 * _MQCMHOffi_t is the definition directly matching the C structure
 * for the MQCMHO so it can be used in the FFI call to the MQI.
 * This is not meant to be used publicly.
 */
var _MQCMHOffi_t = StructType({
  StrucId           : MQT.CHAR4 ,
  Version           : MQT.LONG  ,
  Options           : MQT.LONG  ,
});

/*
 * _MQDMHOffi_t is the definition directly matching the C structure
 * for the MQDMHO so it can be used in the FFI call to the MQI.
 * This is not meant to be used publicly.
 */
var _MQDMHOffi_t = StructType({
  StrucId           : MQT.CHAR4 ,
  Version           : MQT.LONG  ,
  Options           : MQT.LONG  ,
});

/*
 * This function creates the C structure analogue, and
 * also populates it with the default values.
 */
exports._newMQCMHOffi = function() {
  var mqcmho = new _MQCMHOffi_t();
  u.setMQIString(mqcmho.StrucId,"CMHO");
  mqcmho.Version   = 1;
  mqcmho.Options   = MQC.MQCMHO_DEFAULT_VALIDATION;
  return mqcmho;
};

/*
 * This function creates the C structure analogue, and
 * also populates it with the default values.
 */
exports._newMQDMHOffi = function() {
  var mqdmho = new _MQDMHOffi_t();
  u.setMQIString(mqdmho.StrucId,"DMHO");
  mqdmho.Version   = 1;
  mqdmho.Options   = MQC.MQDMHO_NONE;
  return mqdmho;
};

exports._copyCMHOtoC = function(jscmho) {
  var mqcmho = exports._newMQCMHOffi();
  mqcmho.Options = u.flagsToNumber('MQCMHO',jscmho.Options);
  return mqcmho;
};

exports._copyDMHOtoC = function(jsdmho) {
  var mqdmho = exports._newMQDMHOffi();
  mqdmho.Options = u.flagsToNumber('MQDMHO',jsdmho.Options);
  return mqdmho;
};

exports._copyCMHOfromC = function(mqcmho, jscmho) {
  return;
};

exports._copyDMHOfromC = function(mqdmho, jsdmho) {
  return;
};

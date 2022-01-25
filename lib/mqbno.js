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
 * MQBNO is a JavaScript object containing the fields we need for the MQBNO
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
 * This is a class containing the fields needed for the MQBNO
 * (MQ Balance Options Parameters) structure.
 */
exports.MQBNO  = function() {
  /** @member {number} */
  this.ApplType      = MQC.MQBNO_BALTYPE_SIMPLE;
  /** @member {number} */
  this.Timeout       = MQC.MQBNO_TIMEOUT_AS_DEFAULT;
  /** @member {number} */
  this.Options       = MQC.MQBNO_OPTIONS_NONE;
  Object.seal(this);
};

/*
 * _MQBNOffi_t is the definition directly matching the C structure
 * for the MQBNO so it can be used in the FFI call to the MQI.
 * This is not meant to be used publicly.
 */
var _MQBNOffi_t = StructType({
  StrucId         : MQT.CHAR4 ,
  Version         : MQT.LONG  ,
  ApplType        : MQT.LONG  ,
  Timeout         : MQT.LONG  ,
  Options         : MQT.LONG
});

/*
 * This function creates the C structure analogue, and
 * also populates it with the default values.
 */
exports._newMQBNOffi = function() {
  var bno = new _MQBNOffi_t();

  u.setMQIString(bno.StrucId,"BNO ");
  bno.Version  = MQC.MQBNO_VERSION_1;
  bno.ApplType = MQC.MQBNO_BALTYPE_SIMPLE;
  bno.Timeout  = MQC.MQBNO_TIMEOUT_AS_DEFAULT;
  bno.Options  = MQC.MQBNO_OPTIONS_NONE;

  return bno;
};

'use strict';
/*
  Copyright (c) IBM Corporation 2017

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific

   Contributors:
     Mark Taylor - Initial Contribution
*/

/*
 * MQCBD is a JavaScript object containing the fields we need for the MQCBD
 * in a more idiomatic style than the C definition - in particular for
 * fixed length character buffers.
 */

// Import packages for handling structures
var ref        = require('ref');
var StructType = require('ref-struct');
var ArrayType  = require('ref-array');

// Import MQI definitions
var MQC        = require('./mqidefs.js');
var MQT        = require('./mqitypes.js');
var u          = require('./mqiutils.js');

/*
 * This constructor sets default values for the object
 */
exports.MQCBD = function() {
 this.CallbackType     = MQC.MQCBT_MESSAGE_CONSUMER;
 this.Options          = MQC.MQCBDO_NONE;
 this.CallbackArea     = null;
 this.CallbackFunction = null;
 this.CallbackName     = null;
 this.MaxMsgLength     = MQC.MQCBD_FULL_MSG_LENGTH;
 Object.seal(this);
}


/*
 * _MQCBDffi_t is the definition directly matching the C structure
 * for the MQCBD so it can be used in the FFI call to the MQI.
 * This is not meant to be used publicly.
 */
var _MQCBDffi_t = StructType({
       StrucId            : MQT.CHAR4
,      Version            : MQT.LONG
,      CallbackType       : MQT.LONG
,      Options            : MQT.LONG
,      CallbackArea       : MQT.PTR
,      CallbackFunction   : MQT.PTR
,      CallbackName       : MQT.CHAR128
,      MaxMsgLength       : MQT.LONG
});

/*
 * This function creates the C structure analogue, and
 * populates it with default values.
 */
exports._newMQCBDffi = function() {
  var cbd = new _MQCBDffi_t();

  u.setMQIString(cbd.StrucId,"CBD ");
  cbd.Version     = 1;
  cbd.CallbackType = MQC.MQCBT_MESSAGE_CONSUMER;
  cbd.Options     = MQC.MQCBDO_NONE;

  cbd.CallbackArea = ref.NULL;
  cbd.CallbackFunction = ref.NULL;
  u.fillMQIString(cbd.CallbackName,0); // Do not try to set CBName and CBFunction
  cbd.MaxMsgLength = MQC.MQCBD_FULL_MSG_LENGTH;
  return cbd
}

/*
 * Copy from the JavaScript version of the MQCBD structure
 * into the C version
 */
exports._copyCBDtoC = function(jscbd) {
  var mqcbd = exports._newMQCBDffi();
  mqcbd.Version = 1;
  mqcbd.CallbackType = jscbd.CallbackType;
  mqcbd.Options = jscbd.Options;
  if (jscbd.CallbackArea) {
    mqcbd.CallbackArea = Buffer.alloc(jscbd.CallbackArea);
  }
  mqcbd.CallbackFunction = ref.NULL; // We fill this in later
  u.fillMQIString(mqcbd.CallbackName,0);
  mqcbd.MaxMsgLength = jscbd.MaxMsgLength;
  return mqcbd;
}

/*
 * And copy back the fields that might have changed
 */
exports._copyCBDfromC = function(mqcbd,jscbd) {
  // No modified fields
  return jscbd
}

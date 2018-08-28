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
  See the License for the specific language governing permissions and
  limitations under the License.

   Contributors:
     Mark Taylor - Initial Contribution
*/

/*
 * MQCTLO is a JavaScript object containing the fields we need for the MQCTLO
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

/**
 * This constructor sets default values for the object.
 * @class
 * @classdesc
 * This is a class containing the fields needed for the MQCTLO
 * (MQ Control Callback Options) structure. See the
 * {@link https://www.ibm.com/support/knowledgecenter/en/SSFKSJ_9.0.0/com.ibm.mq.ref.dev.doc/q095800_.htm|MQ Knowledge Center}
 * for more details on the usage of each field.
 * Not all of the underlying fields may be exposed in this object.
 */
exports.MQCTLO = function() {
  /** @member {number} */
 this.Options          = MQC.MQCTLOO_NONE;
 // TODO: Add ConnectionArea as a Buffer
 Object.seal(this);
};


/*
 * _MQCTLOffi_t is the definition directly matching the C structure
 * for the MQCTLO so it can be used in the FFI call to the MQI.
 * This is not meant to be used publicly.
 */
var _MQCTLOffi_t = StructType({
  StrucId            : MQT.CHAR4,
  Version            : MQT.LONG ,
  Options            : MQT.LONG ,
  Reserved           : MQT.LONG ,
  ConnectionArea     : MQT.PTR
});

/*
 * This function creates the C structure analogue, and
 * populates it with default values.
 */
exports._newMQCTLOffi = function() {
  var ctlo = new _MQCTLOffi_t();

  u.setMQIString(ctlo.StrucId,"CTLO");
  ctlo.Version     = MQC.MQCTLO_VERSION_1;
  ctlo.Options     = MQC.MQCTLO_NONE;
  ctlo.Reserved    = MQC.MQWI_UNLIMITED;
  ctlo.ConnectionArea   = ref.NULL;
  return ctlo;
};

/*
 * Copy from the JavaScript version of the MQCTLO structure
 * into the C version
 */
exports._copyCTLOtoC = function(jsctlo) {
  var mqctlo = exports._newMQCTLOffi();
  mqctlo.Version = 1;
  mqctlo.Options = jsctlo.Options;
  //if (jsctlo.ConnectionArea && jsctlo.ConnectionArea instanceof Buffer) {
  //  mqctlo.ConnectionArea = jsctlo.ConnectionArea;
  //}
  return mqctlo;
};

/*
 * And copy back the fields that might have changed
 */
exports._copyCTLOfromC = function(mqctlo,jsctlo) {
  // No modified fields
  return jsctlo;
};

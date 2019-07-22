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
 * MQSRO is a JavaScript object containing the fields we need for the MQSRO
 * in a more idiomatic style than the C definition - in particular for
 * fixed length character buffers.
 */

// Import packages for handling structures
var ref        = require('ref-napi');
var StructType = require('ref-struct-di')(ref);
var ArrayType  = require('ref-array-di')(ref);

// Import MQI definitions
var MQC        = require('./mqidefs.js');
var MQT        = require('./mqitypes.js');
var u          = require('./mqiutils.js');

/*
 * This constructor sets all the common fields for the structure.
 */
/**
 * This constructor sets default values for the object.
 * @class
 * @classdesc
 * This is a class containing the fields needed for the MQSRO
 * (MQ Subscription Request Options) structure. See the
 * {@link https://www.ibm.com/support/knowledgecenter/en/SSFKSJ_9.0.0/com.ibm.mq.ref.dev.doc/q101940_.htm|MQ Knowledge Center}
 * for more details on the usage of each field.
 */
exports.MQSRO  = function() {
  /** @member {number} */
  this.Options = 0;
  /** @member {number} */
  this.NumPubs = 0;
  Object.seal(this);
};

/*
 * _MQSROffi_t is the definition directly matching the C structure
 * for the MQSRO so it can be used in the FFI call to the MQI.
 * This is not meant to be used publicly.
 */
var _MQSROffi_t = StructType({
  StrucId           : MQT.CHAR4 ,
  Version           : MQT.LONG  ,
  Options           : MQT.LONG  ,
  NumPubs           : MQT.LONG  ,
});

/*
 * This function creates the C structure analogue, and
 * also populates it with the default values.
 */
exports._newMQSROffi = function() {
  var sro = new _MQSROffi_t();
  var i;

  u.setMQIString(sro.StrucId,"SRO ");
  sro.Version           = 1;
  sro.Options           = 0;
  sro.NumPubs           = 0;
  return sro;
};


exports._copySROtoC = function(jssro) {

  var mqsro = exports._newMQSROffi();

  mqsro.Options           = jssro.Options;
  mqsro.NumPubs           = jssro.NumPubs;

  return mqsro;
};

/*
All of the parameters in the MQSRO are input only.
*/
exports._copySROfromC = function(mqsro, jssro) {
  return;
};

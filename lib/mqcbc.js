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
 * MQCBC is a JavaScript object containing the fields we need for the MQCBC
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

/**
 * This constructor sets default values for the object.
 * @class
 * @classdesc
 * This is a class containing the fields needed for the MQCBC
 * (MQ CallBack Context) structure. See the
 * {@link https://www.ibm.com/support/knowledgecenter/en/SSFKSJ_9.0.0/com.ibm.mq.ref.dev.doc/q094330_.htm|MQ Knowledge Center}
 * for more details on the usage of each field.
 * Not all of the underlying fields may be exposed in this object.
 */
exports.MQCBC = function() {
  /** @member {number} */
  this.CallType      = 0;
  /** @member {number} */
  this.State         = 0;
  /** @member {number} */
  this.DataLength    = 0;
  /** @member {number} */
  this.BufferLength  = 0;
  /** @member {number} */
  this.Flags         = 0;
  /** @member {number} */
  this.ReconnectDelay= 0;
  Object.seal(this);
};


/*
 * _MQCBCffi_t is the definition directly matching the C structure
 * for the MQCBC so it can be used in the FFI call to the MQI.
 * This is not meant to be used publicly.
 */
var _MQCBCffi_t = StructType({
       StrucId            : MQT.CHAR4 ,
       Version            : MQT.LONG  ,
       CallType           : MQT.LONG  ,
       Hobj               : MQT.HOBJ  ,
       CallbackArea       : MQT.PTR   ,
       ConnectionArea     : MQT.PTR   ,
       CompCode           : MQT.LONG  ,
       Reason             : MQT.LONG  ,
       State              : MQT.LONG  ,
       DataLength         : MQT.LONG  ,
       BufferLength       : MQT.LONG  ,
       Flags              : MQT.LONG  ,
       ReconnectDelay     : MQT.LONG
});
exports._MQCBCffi_t = _MQCBCffi_t;

/*
 * And copy back the fields that might have changed
 */
exports._copyCBCfromC = function(mqcbc,jscbc) {
 jscbc.CallType       = mqcbc.CallType;
 jscbc.State          = mqcbc.State;
 jscbc.DataLength     = mqcbc.DataLength;
 jscbc.BufferLength   = mqcbc.BufferLength;
 jscbc.Flags          = mqcbc.Flags;
 jscbc.ReconnectDelay = mqcbc.ReconnectDelay;
 return jscbc;
};

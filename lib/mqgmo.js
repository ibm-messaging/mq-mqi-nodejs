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
 * MQGMO is a JavaScript object containing the fields we need for the MQGMO
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
 * This is a class containing the fields needed for the MQGMO
 * (MQ Get Message Options) structure. See the
 * {@link https://www.ibm.com/support/knowledgecenter/en/SSFKSJ_9.0.0/com.ibm.mq.ref.dev.doc/q096710_.htm|MQ Knowledge Center}
 * for more details on the usage of each field.
 * Not all of the underlying fields may be exposed in this object.
 * <p>Note: This sets the FIQ flag by default, which is not standard in the MQI
 * but probably should have been. It's also forced to be set elsewhere.
 */
exports.MQGMO  = function() {
  /** @member {number} */
  this.Options        = MQC.MQGMO_NO_WAIT
                      | MQC.MQGMO_PROPERTIES_AS_Q_DEF
                      | MQC.MQGMO_FAIL_IF_QUIESCING;
  /** @member {number} */
  this.WaitInterval   = MQC.MQWI_UNLIMITED;
  /** @member {String} */
  this.ResolvedQName  = null;
  /** @member {number} */
  this.MatchOptions   = MQC.MQMO_MATCH_MSG_ID | MQC.MQMO_MATCH_CORREL_ID;
  /** @member {char} */
  this.GroupStatus    = ' ';
  /** @member {char} */
  this.SegmentStatus  = ' ';
  /** @member {char} */
  this.Segmentation   = ' ';
  /** @member {Buffer} */
  this.MsgToken       = Buffer.alloc(MQC.MQ_MSG_TOKEN_LENGTH,0);
  /** @member {number} */
  this.ReturnedLength = MQC.MQRL_UNDEFINED;
  /** @member {Object} */
  this.MsgHandle      = MQC.MQHM_NONE;
  Object.seal(this);
};

/*
 * _MQGMOffi_t is the definition directly matching the C structure
 * for the MQGMO so it can be used in the FFI call to the MQI.
 * This is not meant to be used publicly.
 */
var _MQGMOffi_t = StructType({
  StrucId           : MQT.CHAR4 ,
  Version           : MQT.LONG  ,
  Options           : MQT.LONG  ,
  WaitInterval      : MQT.LONG  ,
  Signal1           : MQT.LONG  ,
  Signal2           : MQT.LONG  ,
  ResolvedQName     : MQT.CHAR48  ,
  MatchOptions      : MQT.LONG  ,
  GroupStatus       : MQT.CHAR  ,
  SegmentStatus     : MQT.CHAR  ,
  Segmentation      : MQT.CHAR  ,
  Reserved1         : MQT.CHAR  ,
  MsgToken          : MQT.BYTE16,
  ReturnedLength    : MQT.LONG  ,
  Reserved2         : MQT.LONG  ,
  MsgHandle         : MQT.HMSG  ,
});
exports._MQGMOffi_t = _MQGMOffi_t;

/*
 * This function creates the C structure analogue, and
 * also populates it with the default values.
 */
exports._newMQGMOffi = function() {
  var gmo = new _MQGMOffi_t();

  u.setMQIString(gmo.StrucId,"GMO ");
  gmo.Version        = 4; // Assume we will work with this version.
  gmo.Options        = MQC.MQGMO_NO_WAIT
                     | MQC.MQGMO_PROPERTIES_AS_Q_DEF
                     | MQC.MQGMO_FAIL_IF_QUIESCING;
  gmo.WaitInterval   = MQC.MQWI_UNLIMITED;
  u.setMQIString(gmo.ResolvedQName,"");
  gmo.MatchOptions   = MQC.MQMO_MATCH_MSG_ID | MQC.MQMO_MATCH_CORREL_ID;
  gmo.GroupStatus    = ' ';
  gmo.SegmentStatus  = ' ';
  gmo.Segmentation   = ' ';
  u.fillMQIString(gmo.MsgToken,0);
  gmo.ReturnedLength = MQC.MQRL_UNDEFINED;
  gmo.MsgHandle      = MQC.MQHM_NONE;

  return gmo;
};

exports._copyGMOtoC = function(jsgmo) {

  var mqgmo = exports._newMQGMOffi();
  var i;
  mqgmo.Options          = jsgmo.Options;
  // Force the FIQ option to always be set for good practice
  mqgmo.Options |= MQC.MQGMO_FAIL_IF_QUIESCING;
  mqgmo.WaitInterval     = jsgmo.WaitInterval;
  mqgmo.MatchOptions     = jsgmo.MatchOptions;
  mqgmo.MsgHandle        = jsgmo.MsgHandle;

  for (i = 0; i < MQC.MQ_MSG_TOKEN_LENGTH; i++) {
    mqgmo.MsgToken[i] = jsgmo.MsgToken[i];
  }

  return mqgmo;
};

exports._copyGMOfromC = function(mqgmo, jsgmo) {

  jsgmo.Options          = mqgmo.Options;
  jsgmo.WaitInterval     = mqgmo.WaitInterval;
  jsgmo.ResolvedQName    = u.getMQIString(mqgmo.ResolvedQName);
  jsgmo.GroupStatus      = mqgmo.GroupStatus;
  jsgmo.SegmentStatus    = mqgmo.SegmentStatus;
  jsgmo.Segmentation     = mqgmo.Segmentation;

  for (var i = 0; i < MQC.MQ_MSG_TOKEN_LENGTH; i++) {
    jsgmo.MsgToken[i] = mqgmo.MsgToken[i];
  }
  jsgmo.ReturnedLength   = mqgmo.ReturnedLength;

  return;
};

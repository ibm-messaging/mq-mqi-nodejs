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
 * MQPMO is a JavaScript object containing the fields we need for the MQPMO
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
 * This is a class containing the fields needed for the MQPMO
 * (MQ Put Message Options) structure. See the
 * {@link https://www.ibm.com/support/knowledgecenter/en/SSFKSJ_latest/com.ibm.mq.ref.dev.doc/q098650_.htm|MQ Knowledge Center}
 * for more details on the usage of each field.
 * Not all of the underlying fields may be exposed in this object.
 * <p>Note: This sets the FIQ flag by default, which is not standard in the MQI
 * but probably should have been. It's also forced to be set elsewhere.
 */
exports.MQPMO  = function() {
  /** @member {number} */
  this.Options          = MQC.MQPMO_FAIL_IF_QUIESCING;
  /** @member {String} */
  this.Context          = null; // This would be set to an MQObject

  /** @member {String} */
  this.ResolvedQName    = null;
  /** @member {String} */
  this.ResolvedQMgrName = null;

  // This API is not going to support distribution lists - use pub/sub instead.
  // I've left the fields here, but commented out so you can see them.
  //
  // this.KnownDestCount   = 0
  // this.UnknownDestCount = 0
  // this.InvalidDestCount = 0
  // this.RecsPresent = 0
  // this.PutMsgRecFields = 0
  // this.PutMsgRecOffset = 0
  // this.ResponseRecOffset = 0
  // this.PutMsgRecPtr = null
  // this.ResponseRecPtr = null

  /** @member {number} */
  this.OriginalMsgHandle = MQC.MQHM_NONE;
  /** @member {number} */
  this.NewMsgHandle      = MQC.MQHM_NONE;
  /** @member {number} */
  this.Action            = MQC.MQACTP_NEW;
  /** @member {number} */
  this.PubLevel          = 9;
  Object.seal(this);

};

/*
 * _MQPMOffi_t is the definition directly matching the C structure
 * for the MQPMO so it can be used in the FFI call to the MQI.
 * This is not meant to be used publicly.
 */
var _MQPMOffi_t = StructType({
  StrucId           : MQT.CHAR4 ,
  Version           : MQT.LONG  ,
  Options           : MQT.LONG  ,
  Timeout           : MQT.LONG  ,
  Context           : MQT.HOBJ  ,

  KnownDestCount    : MQT.LONG  ,
  UnknownDestCount  : MQT.LONG  ,
  InvalidDestCount  : MQT.LONG  ,
  ResolvedQName     : MQT.CHAR48,
  ResolvedQMgrName  : MQT.CHAR48,

  RecsPresent       : MQT.LONG  ,
  PutMsgRecFields   : MQT.LONG  ,
  PutMsgRecOffset   : MQT.LONG  ,
  ResponseRecOffset : MQT.LONG  ,
  PutMsgRecPtr      : MQT.PTR   ,
  ResponseRecPtr    : MQT.PTR   ,

  OriginalMsgHandle : MQT.HMSG  ,
  NewMsgHandle      : MQT.HMSG  ,
  Action            : MQT.LONG  ,
  PubLevel          : MQT.LONG  ,
});

/*
 * This function creates the C structure analogue, and
 * also populates it with the default values.
 */
exports._newMQPMOffi = function() {
  var pmo = new _MQPMOffi_t();

  u.setMQIString(pmo.StrucId,"PMO ");
  pmo.Version          = 3; // Always assume we will work with this version
  pmo.Options          = MQC.MQPMO_FAIL_IF_QUIESCING;
  pmo.Timeout          = -1;
  pmo.Context          = 0;
  pmo.KnownDestCount   = 0;
  pmo.UnknownDestCount = 0;
  pmo.InvalidDestCount = 0;
  pmo.ResolvedQName[0] = 0;    // Some versions of MQ z/OS check these fields even on input
  pmo.ResolvedQMgrName[0] = 0; // and (incorrectly) require 0 not spaces. So deal with that anomaly here

  pmo.RecsPresent = 0;
  pmo.PutMsgRecFields = 0;
  pmo.PutMsgRecOffset = 0;
  pmo.ResponseRecOffset = 0;
  pmo.PutMsgRecPtr = ref.NULL;
  pmo.ResponseRecPtr = ref.NULL;

  pmo.OriginalMsgHandle = MQC.MQHM_NONE;
  pmo.NewMsgHandle      = MQC.MQHM_NONE;
  pmo.Action            = MQC.MQACTP_NEW;
  pmo.PubLevel          = 9;

  return pmo;

};

exports._copyPMOtoC = function(jspmo) {

  var mqpmo = exports._newMQPMOffi();
  mqpmo.Options          = jspmo.Options;
  // Force the FIQ option to always be set for good practice
  mqpmo.Options |= MQC.MQPMO_FAIL_IF_QUIESCING;

  if (jspmo.Context != null) {
    mqpmo.Context          = jspmo.Context._hObj;
  }
  mqpmo.OriginalMsgHandle = jspmo.OriginalMsgHandle;
  mqpmo.NewMsgHandle      = jspmo.NewMsgHandle;
  mqpmo.Action            = jspmo.Action;
  mqpmo.PubLevel          = jspmo.PubLevel;

  return mqpmo;
};

exports._copyPMOfromC = function(mqpmo, jspmo) {

  jspmo.Options          = mqpmo.Options;
  jspmo.ResolvedQName    = u.getMQIString(mqpmo.ResolvedQName);
  jspmo.ResolvedQMgrName = u.getMQIString(mqpmo.ResolvedQMgrName);

  jspmo.OriginalMsgHandle = mqpmo.OriginalMsgHandle;
  jspmo.NewMsgHandle      = mqpmo.NewMsgHandle;
  jspmo.PubLevel          = mqpmo.PubLevel;

  return;
};

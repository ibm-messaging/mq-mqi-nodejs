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
 * MQSTS is a JavaScript object containing the fields we need for the MQSTS
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
 * This is a class containing the fields needed for the MQSTS
 * (MQ Status reporting) structure. See the
 * {@link https://www.ibm.com/support/knowledgecenter/en/SSFKSJ_latest/com.ibm.mq.ref.dev.doc/q100540_.htm|MQ Knowledge Center}
 * for more details on the usage of each field.
 */
exports.MQSTS  = function() {
  /** @member {number} */
  this.CompCode          = MQC.MQCC_OK;
  /** @member {number} */
  this.Reason            = MQC.MQRC_NONE;
  /** @member {number} */
  this.PutSuccessCount   = 0;
  /** @member {number} */
  this.PutWarningCount   = 0;
  /** @member {number} */
  this.PutFailureCount   = 0;

  /** @member {number} */
  this.ObjectType        = MQC.MQOT_Q;
  /** @member {String} */
  this.ObjectName        = null;
  /** @member {String} */
  this.ObjectQMgrName    = null;
  /** @member {String} */
  this.ResolvedObjectName= null;
  /** @member {String} */
  this.ResolvedQMgrName  = null;

  /** @member {String} */
  this.ObjectString      = null;
  /** @member {String} */
  this.SubName           = null;
  /** @member {number} */
  this.OpenOptions       = 0;
  /** @member {number} */
  this.SubOptions        = 0;
  Object.seal(this);
};

/*
 * _MQSTSffi_t is the definition directly matching the C structure
 * for the MQSTS so it can be used in the FFI call to the MQI.
 * This is not meant to be used publicly.
 */
var _MQSTSffi_t = StructType({
  StrucId           : MQT.CHAR4 ,
  Version           : MQT.LONG  ,
  CompCode          : MQT.LONG  ,
  Reason            : MQT.LONG  ,
  PutSuccessCount   : MQT.LONG  ,
  PutWarningCount   : MQT.LONG  ,
  PutFailureCount   : MQT.LONG  ,

  ObjectType        : MQT.LONG  ,
  ObjectName        : MQT.CHAR48,
  ObjectQMgrName    : MQT.CHAR48,
  ResolvedObjectName: MQT.CHAR48,
  ResolvedQMgrName  : MQT.CHAR48,

  ObjectString      : MQT.CHARV ,
  SubName           : MQT.CHARV ,
  OpenOptions       : MQT.LONG  ,
  SubOptions        : MQT.LONG
});

/*
 * This function creates the C structure analogue, and
 * also populates it with the default values.
 */
exports._newMQSTSffi = function() {
  var mqsts = new _MQSTSffi_t();

  u.setMQIString(mqsts.StrucId,"STAT");
  mqsts.Version           = 2;

  mqsts.CompCode         = MQC.MQCC_OK;
  mqsts.Reason           = MQC.MQRC_NONE;
  mqsts.PutSuccessCount  = 0;
  mqsts.PutWarningCount  = 0;
  mqsts.PutFailureCount  = 0;

  mqsts.ObjectType       = MQC.MQOT_Q;
  u.setMQIString(mqsts.ObjectName,"");
  u.setMQIString(mqsts.ObjectQMgrName    ,"");
  u.setMQIString(mqsts.ResolvedObjectName,"");
  u.setMQIString(mqsts.ResolvedQMgrName  ,"");

  u.defaultCharV(mqsts.ObjectString);
  u.defaultCharV(mqsts.SubName);
  mqsts.OpenOptions       = 0;
  mqsts.SubOptions        = 0;

  return mqsts;
};


exports._copySTStoC = function(jssts) {

  var mqsts = exports._newMQSTSffi();

  return mqsts;
};

exports._copySTSfromC = function(mqsts, jssts) {

  jssts.CompCode         = mqsts.CompCode;
  jssts.Reason           = mqsts.Reason;
  jssts.PutSuccessCount  = mqsts.PutSuccessCount;
  jssts.PutWarningCount  = mqsts.PutWarningCount;
  jssts.PutFailureCount  = mqsts.PutFailureCount;

  jssts.ObjectType       = mqsts.ObjectType;
  jssts.ObjectName       = u.getMQIString(mqsts.ObjectName);
  jssts.ObjectQMgrName   = u.getMQIString(mqsts.ObjectQMgrName);
  jssts.ResolvedObjectName=u.getMQIString(mqsts.ResolvedObjectName);
  jssts.ResolvedQMgrName = u.getMQIString(mqsts.ResolvedQMgrName);

  jssts.ObjectString      = u.getMQICharV(mqsts.ObjectString);
  jssts.SubName           = u.getMQICharV(mqsts.SubName);
  jssts.OpenOptions       = u.flagsFromNumber('MQOO',jssts.OpenOptions,mqsts.OpenOptions);
  jssts.SubOptions        = u.flagsFromNumber('MQSO',jssts.SubOptions,mqsts.SubOptions);

  return;
};

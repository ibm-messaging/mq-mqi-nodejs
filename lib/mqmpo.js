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
 * This is a class containing the fields needed for the MQIMPO
 * (MQ Inquire Message Property Options) structure. See the
 * {@link https://www.ibm.com/support/knowledgecenter/en/SSFKSJ_latest/com.ibm.mq.ref.dev.doc/q097210_.htm|MQ Knowledge Center}
 * for more details on the usage of each field.
 */
exports.MQIMPO  = function() {
  /** @member {number} */
  this.Options = MQC.MQIMPO_NONE;
  /** @member {String} */
  this.ReturnedName = null;
  /** @member {String} */
  this.TypeString = null;
  /** @member {number} */
  this.ReturnedEncoding = MQC.MQENC_NATIVE;
  /* @member {number} */
  this.ReturnedCCSID = MQC.MQCCSI_APPL;
  Object.seal(this);
};

/**
 * This constructor sets default values for the object.
 * @class
 * @classdesc
 * This is a class containing the fields needed for the MQSMPO
 * (MQ Set Message Property Options) structure. See the
 * {@link https://www.ibm.com/support/knowledgecenter/en/SSFKSJ_latest/com.ibm.mq.ref.dev.doc/q100270_.htm|MQ Knowledge Center}
 * for more details on the usage of each field.
 */
exports.MQSMPO  = function() {
  /** @member {number} */
  this.Options = MQC.MQSMPO_SET_FIRST;
  Object.seal(this);
};

/**
 * This constructor sets default values for the object.
 * @class
 * @classdesc
 * This is a class containing the fields needed for the MQDMPO
 * (MQ Delete Message Property Options) structure. See the
 * {@link https://www.ibm.com/support/knowledgecenter/en/SSFKSJ_latest/com.ibm.mq.ref.dev.doc/q096430_.htm|MQ Knowledge Center}
 * for more details on the usage of each field.
 */
exports.MQDMPO  = function() {
  /** @member {number} */
  this.Options = MQC.MQDMPO_DEL_FIRST;
  Object.seal(this);
};

/**
 * This constructor sets default values for the object.
 * @class
 * @classdesc
 * This is a class containing the fields needed for the MQPD
 * (MQ Property Descriptor) structure. See the
 * {@link https://www.ibm.com/support/knowledgecenter/en/SSFKSJ_latest/com.ibm.mq.ref.dev.doc/q098510_.htm|MQ Knowledge Center}
 * for more details on the usage of each field.
 */
exports.MQPD  = function() {
  /** @member {number} */
  this.Options = MQC.MQPD_NONE;
  /** @member {number} */
  this.Support = MQC.MQPD_SUPPORT_OPTIONAL;
  /** @member {number} */
  this.Context = MQC.MQPD_NO_CONTEXT;
  /** @member {number} */
  this.CopyOptions = MQC.MQCOPY_DEFAULT;
  Object.seal(this);
};

/*
 * _MQCMPOffi_t is the definition directly matching the C structure
 * for the MQCMPO so it can be used in the FFI call to the MQI.
 * This is not meant to be used publicly.
 */
var _MQIMPOffi_t = StructType({
  StrucId           : MQT.CHAR4 ,
  Version           : MQT.LONG  ,
  Options           : MQT.LONG  ,
  RequestedEncoding : MQT.LONG  ,
  RequestedCCSID    : MQT.LONG  ,
  ReturnedEncoding  : MQT.LONG  ,
  ReturnedCCSID     : MQT.LONG  ,
  Reserved1         : MQT.LONG  ,
  ReturnedName      : MQT.CHARV,
  TypeString        : MQT.CHAR8
});

var _MQSMPOffi_t = StructType({
  StrucId           : MQT.CHAR4 ,
  Version           : MQT.LONG  ,
  Options           : MQT.LONG  ,
  ValueEncoding     : MQT.LONG  ,
  ValueCCSID        : MQT.LONG  ,
});

var _MQDMPOffi_t = StructType({
  StrucId           : MQT.CHAR4 ,
  Version           : MQT.LONG  ,
  Options           : MQT.LONG  ,
});

var _MQPDffi_t = StructType({
  StrucId           : MQT.CHAR4 ,
  Version           : MQT.LONG  ,
  Options           : MQT.LONG  ,
  Support           : MQT.LONG  ,
  Context           : MQT.LONG  ,
  CopyOptions       : MQT.LONG  ,
});

/*
 * This function creates the C structure analogue, and
 * also populates it with the default values.
 */
exports._newMQIMPOffi = function() {
  var mqimpo = new _MQIMPOffi_t();
  u.setMQIString(mqimpo.StrucId,"IMPO");
  mqimpo.Version          = 1;
  mqimpo.Options          = MQC.MQIMPO_INQ_FIRST;
  mqimpo.RequestedEncoding= MQC.MQENC_NATIVE;
  mqimpo.RequestedCCSID   = MQC.MQCCSI_APPL;
  mqimpo.ReturnedEncoding = MQC.MQENC_NATIVE;
  mqimpo.ReturnedCCSID    = 0;
  mqimpo.Reserved1        = 0;
  u.defaultCharV(mqimpo.ReturnedName);
  u.setMQIString(mqimpo.TypeString,"");
  return mqimpo;
};

exports._newMQSMPOffi = function() {
  var mqsmpo = new _MQSMPOffi_t();
  u.setMQIString(mqsmpo.StrucId,"SMPO");
  mqsmpo.Version   = 1;
  mqsmpo.Options   = MQC.MQSMPO_SET_FIRST;
  mqsmpo.ValueEncoding = MQC.MQENC_NATIVE;
  mqsmpo.ValueCCSID = MQC.MQCCSI_APPL;
  return mqsmpo;
};

exports._newMQDMPOffi = function() {
  var mqdmpo = new _MQDMPOffi_t();
  u.setMQIString(mqdmpo.StrucId,"DMPO");
  mqdmpo.Version   = 1;
  mqdmpo.Options   = MQC.MQDMPO_DEL_FIRST;
  return mqdmpo;
};

exports._newMQPDffi = function() {
  var mqpd = new _MQPDffi_t();
  u.setMQIString(mqpd.StrucId,"PD  ");
  mqpd.Version   = 1;
  mqpd.Options =  MQC.MQPD_NONE;
  mqpd.Support =  MQC.MQPD_SUPPORT_OPTIONAL;
  mqpd.Context =  MQC.MQPD_NO_CONTEXT;
  mqpd.CopyOptions = MQC.MQCOPY_DEFAULT;
  return mqpd;
};

/******** Copy to C ************/
exports._copyIMPOtoC = function(jsimpo) {
  var mqimpo = exports._newMQIMPOffi();
  mqimpo.Options = jsimpo.Options;
  return mqimpo;
};

exports._copySMPOtoC = function(jssmpo) {
  var mqsmpo = exports._newMQSMPOffi();
  mqsmpo.Options = jssmpo.Options;
  return mqsmpo;
};

exports._copyDMPOtoC = function(jsdmpo) {
  var mqdmpo = exports._newMQDMPOffi();
  mqdmpo.Options = jsdmpo.Options;
  return mqdmpo;
};

exports._copyPDtoC = function(jspd) {
  var mqpd = exports._newMQPDffi();
  mqpd.Options = jspd.Options;
  mqpd.Support = jspd.Support;
  mqpd.Context = jspd.Context;
  mqpd.CopyOptions = jspd.CopyOptions;
  return mqpd;
};

/********* Copy from C **********/
exports._copyIMPOfromC = function(mqimpo, jsimpo) {
  jsimpo.ReturnedName = u.getMQICharV(mqimpo.ReturnedName);
  jsimpo.TypeString   = u.getMQIString(mqimpo.TypeString);
  jsimpo.ReturnedEncoding = mqimpo.ReturnedEncoding;
  jsimpo.ReturnedCCSID    = mqimpo.ReturnedCCSID;
  return;
};

exports._copySMPOfromC = function(mqsmpo, jssmpo) {
  return;
};

exports._copyDMPOfromC = function(mqdmpo, jsdmpo) {
  return;
};

exports._copyPDfromC = function(mqpd, jspd) {
  return;
};

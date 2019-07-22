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
 * mqdlh is a JavaScript object containing the fields we need for the MQDLH
 * in a more idiomatic style than the C definition - in particular for
 * fixed length character buffers.
 */
var ref        = require('ref-napi');
var StructType = require('ref-struct-di')(ref);
var ArrayType  = require('ref-array-di')(ref);

var MQC        = require('./mqidefs.js');
var MQT        = require('./mqitypes.js');
var u          = require('./mqiutils.js');

/**
 * This constructor sets default values for the object.
 * @class
 * @classdesc
 * This is a class containing the fields needed for the mqdlh
 * (MQ Dead Letter Header) structure. See the
 * {@link https://www.ibm.com/support/knowledgecenter/en/SSFKSJ_9.0.0/com.ibm.mq.ref.dev.doc/q096110_.htm|MQ Knowledge Center}
 * for more details on the usage of each field.
 * Not all of the underlying fields may be exposed in this object.
 */
exports.MQDLH  = function(mqmd) {
  /** @member {number} */
  this.Reason          = MQC.MQRC_NONE;
  /** @member {String} */
  this.DestQName       = null;
  /** @member {String} */
  this.DestQMgrName    = null;
  /** @member {number} */
  this.Encoding       = 0;
  /** @member {number} */
  this.CodedCharSetId = MQC.MQCCSI_UNDEFINED;
  /** @member {Buffer} */
  this.Format         = Buffer.alloc(MQC.MQ_FORMAT_LENGTH, ' ');
  /** @member {number} */
  this.PutApplType     = 0;
  /** @member {String} */
  this.PutApplName     = null;
  /** @member {String} */
  this.PutDate         = null;
  /** @member {String} */
  this.PutTime         = null;
  /** @member {number} */
  this.StrucLength = MQC.MQDLH_CURRENT_LENGTH; /* Not a field in C structure */

  // If a message descriptor has been supplied then we can
  // copy some fields from it and set its own fields. This does
  // the header chaining we need to describe the real data.
  if (mqmd) {
    this.Encoding       = mqmd.Encoding;
    if (mqmd.CodedCharSetId == MQC.MQCCSI_DEFAULT)
      this.CodedCharSetId = MQC.MQCCSI_INHERIT;
    else
      this.CodedCharSetId = mqmd.CodedCharSetId;
    this.Format = mqmd.Format;

    mqmd.Format = MQC.MQFMT_DEAD_LETTER_HEADER;
    mqmd.MsgType = MQC.MQMT_REPORT;
    mqmd.CodedCharSetId = MQC.MQCCSI_Q_MGR;
  }

  Object.seal(this);
};


/*
 * _MQDLHffi_t is the definition directly matching the C structure
 * for the MQDLH so it can be used in the FFI call to the MQI.
 * This is not meant to be used publicly.
 */
var _MQDLHffi_t = StructType({
  StrucId           : MQT.CHAR4 ,
  Version           : MQT.LONG  ,
  Reason            : MQT.LONG  ,
  DestQName         : MQT.CHAR48,
  DestQMgrName      : MQT.CHAR48,
  Encoding          : MQT.LONG  ,
  CodedCharSetId    : MQT.LONG  ,
  Format            : MQT.CHAR8 ,
  PutApplType       : MQT.LONG  ,
  PutApplName       : MQT.CHAR28,
  PutDate           : MQT.CHAR8 ,
  PutTime           : MQT.CHAR8
});

/*
 * This function creates the C structure analogue, and
 * also populates it with the default values.
 */
function _newMQDLHffi() {
  var dlh = new _MQDLHffi_t();

  u.setMQIString(dlh.StrucId,"DLH ");
  dlh.Version        = 1; // We will always work with this version
  dlh.Reason         = MQC.MQRC_NONE;
  dlh.Encoding       = 0;
  dlh.CodedCharSetId = MQC.MQCCSI_UNDEFINED;
  u.setMQIString(dlh.Format," ");

  u.setMQIString(dlh.DestQName      , "");
  u.setMQIString(dlh.DestQMgrName   , "");

  dlh.PutApplType     = 0;
  u.setMQIString(dlh.PutApplName     , "");

  u.setMQIString(dlh.PutDate         , "");
  u.setMQIString(dlh.PutTime         , "");

  return dlh;
}

/*
 * Create a new C mqdlh structure and fill it in from the
 * user-supplied JS version of the mqdlh. This does not need to
 * be exported as it is only used in this module.
 */
function _copyDLHtoC(jsdlh) {

  var mqdlh = _newMQDLHffi();
  mqdlh.Reason   = jsdlh.Reason;
  u.setMQIString(mqdlh.DestQName , jsdlh.DestQName);
  u.setMQIString(mqdlh.DestQMgrName, jsdlh.DestQMgrName);
  mqdlh.Encoding = jsdlh.Encoding;
  mqdlh.CodedCharSetId = jsdlh.CodedCharSetId;
  u.setMQIString(mqdlh.Format, jsdlh.Format);

  mqdlh.PutApplType = jsdlh.PutApplType;
  u.setMQIString(mqdlh.PutApplName, jsdlh.PutApplName);
  u.setMQIString(mqdlh.PutDate, jsdlh.PutDate);
  u.setMQIString(mqdlh.PutTime, jsdlh.PutTime);

  return mqdlh;
}

/*
 * Update the JS DLH from any fields returned in the
 * C structure. There is currently only one version of the
 * DLH so the StrucLength field does not need to depend on the version
 * in the MQDLH structure.
 */
function _copyDLHfromC(mqdlh, jsdlh) {
  var i;
  jsdlh.Reason      = mqdlh.Reason;
  jsdlh.DestQName   = u.getMQIString(mqdlh.DestQName);
  jsdlh.DestQMgrName= u.getMQIString(mqdlh.DestQMgrName);
  jsdlh.Encoding    = mqdlh.Encoding;
  jsdlh.CodedCharSetId = mqdlh.CodedCharSetId;
  jsdlh.Format      = u.getMQIString(mqdlh.Format);
  jsdlh.PutApplType     = mqdlh.PutApplType;
  jsdlh.PutApplName     = u.getMQIString(mqdlh.PutApplName);
  jsdlh.PutDate         = u.getMQIString(mqdlh.PutDate);
  jsdlh.PutTime         = u.getMQIString(mqdlh.PutTime);
  jsdlh.StrucLength          = MQC.MQDLH_CURRENT_LENGTH;
  return;
}

/**
 * The getBuffer function returns a version of the structure that can
 * be part of the message data when it is put to a queue. Use in conjunction
 * with Buffer.concat() to combine the buffers into a single buffer.
 */
exports.MQDLH.prototype.getBuffer = function() {
  return _copyDLHtoC(this).ref();
};

/**
 * The getHeader function returns a JS structure. The StrucLength member
 * can be used to show how far to step through the message buffer for the
 * next element.
 */
exports.MQDLH.getHeader = function(buf) {
  var jsdlh = new exports.MQDLH();
  _copyDLHfromC(ref.get(buf,0,_MQDLHffi_t),jsdlh);
  return jsdlh;
};

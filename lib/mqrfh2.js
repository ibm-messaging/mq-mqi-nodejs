'use strict';
/*
  Copyright (c) IBM Corporation 2017,2019

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
 * mqrfh2 is a JavaScript object containing the fields we need for the MQRFH2
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
 * This is a class containing the fields needed for the
 * MQ RFH2 Header structure. See the
 * {@link https://www.ibm.com/support/knowledgecenter/en/SSFKSJ_9.0.0/com.ibm.mq.ref.dev.doc/q096110_.htm|MQ Knowledge Center}
 * for more details on the usage of each field.
 * Not all of the underlying fields may be exposed in this object.
 */
exports.MQRFH2  = function(mqmd) {
  /** @member {number} */
  this.StrucLength    = MQC.MQRFH_STRUC_LENGTH_FIXED_2;
  /** @member {number} */
  this.Encoding       = MQC.MQENC_NATIVE;
  /** @member {number} */
  this.CodedCharSetId = MQC.MQCCSI_INHERIT;
  /** @member {Buffer} */
  this.Format         = Buffer.alloc(MQC.MQ_FORMAT_LENGTH, ' ');
  /** @member {number} */
  this.Flags          = MQC.MQRFH_NONE;
  /** @member {number} */
  this.NameValueCCSID = 1208;


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

    mqmd.Format = "MQHRF2";
    mqmd.CodedCharSetId = MQC.MQCCSI_Q_MGR;
  }

  Object.seal(this);
};


/*
 * _MQRFH2ffi_t is the definition directly matching the C structure
 * for the MQRFH2 so it can be used in the FFI call to the MQI.
 * This is not meant to be used publicly.
 */
var _MQRFH2ffi_t = StructType({
  StrucId           : MQT.CHAR4 ,
  Version           : MQT.LONG  ,
  StrucLength       : MQT.LONG  ,
  Encoding          : MQT.LONG  ,
  CodedCharSetId    : MQT.LONG  ,
  Format            : MQT.CHAR8 ,
  Flags             : MQT.LONG  ,
  NameValueCCSID    : MQT.LONG
});

/*
 * This function creates the C structure analogue, and
 * also populates it with the default values.
 */
function _newMQRFH2ffi() {
  var rfh2 = new _MQRFH2ffi_t();

  u.setMQIString(rfh2.StrucId,"RFH2 ");
  rfh2.Version        = 2; // We will always work with this version
  rfh2.StrucLength    = MQC.MQRFH_STRUC_LENGTH_FIXED_2;
  rfh2.Encoding       = MQC.MQENC_NATIVE;
  rfh2.CodedCharSetId = MQC.MQCCSI_INHERIT;

  u.setMQIString(rfh2.Format,MQC.MQFMT_NONE);
  rfh2.Flags          = MQC.MQRFH_NONE;
  return rfh2;
}

/*
 * Create a new C mqRFH2 structure and fill it in from the
 * user-supplied JS version of the mqRFH2. This does not need to
 * be exported as it is only used in this module.
 */
function _copyRFH2toC(jsRFH2) {

  var mqRFH2 = _newMQRFH2ffi();

  mqRFH2.Encoding = jsRFH2.Encoding;
  mqRFH2.CodedCharSetId = jsRFH2.CodedCharSetId;
  mqRFH2.Flags          = jsRFH2.Flags;
  u.setMQIString(mqRFH2.Format, jsRFH2.Format);

  return mqRFH2;
}

/*
 * Update the JS RFH2 from any fields returned in the
 * C structure. There is currently only one version of the
 * RFH2 so the StrucLength field does not need to depend on the version
 * in the MQRFH2 structure.
 */
function _copyRFH2fromC(mqRFH2, jsRFH2) {
  var i;

  jsRFH2.Encoding       = mqRFH2.Encoding;
  jsRFH2.CodedCharSetId = mqRFH2.CodedCharSetId;
  jsRFH2.NameValueCCSID = mqRFH2.NameValueCSSID;
  jsRFH2.Flags          = mqRFH2.Flags;
  jsRFH2.Format         = u.getMQIString(mqRFH2.Format);
  jsRFH2.StrucLength    = mqRFH2.StrucLength;
  return;
}

/**
 * The getBuffer function returns a version of the structure that can
 * be part of the message data when it is put to a queue. Use in conjunction
 * with Buffer.concat() to combine the buffers into a single buffer.
 */
exports.MQRFH2.prototype.getBuffer = function() {
  return _copyRFH2toC(this).ref();
};

/**
 * The getHeader function returns a JS structure. The StrucLength member
 * can be used to show how far to step through the message buffer for the
 * next element.
 */
exports.MQRFH2.getHeader = function(buf) {
  var jsRFH2 = new exports.MQRFH2();
  _copyRFH2fromC(ref.get(buf,0,_MQRFH2ffi_t),jsRFH2);
  return jsRFH2;
};

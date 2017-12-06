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
 * MQCNO is a JavaScript object containing the fields we need for the MQCNO
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

// Also need references to the other structures used in the MQCNO
var MQCSP      = require('./mqcsp.js'); // Security Parms
var MQSCO      = require('./mqsco.js'); // SSL Config
var MQCD       = require('./mqcd.js');  // Channel Definition

/**
 * This constructor sets default values for the object.
 * @class
 * @classdesc
 * This is a class containing the fields needed for the MQCNO
 * (MQ Connection Options) structure. See the
 * {@link https://www.ibm.com/support/knowledgecenter/en/SSFKSJ_9.0.0/com.ibm.mq.ref.dev.doc/q095410_.htm|MQ Knowledge Center}
 * for more details on the usage of each field.
 * Not all of the underlying fields may be exposed in this object.
 */
exports.MQCNO  = function() {
  /** @member {number} */
  this.Options        = MQC.MQCNO_NONE;
  /** @member {MQCSP} */
  this.SecurityParms  = null;
  /** @member {String} */
  this.CCDTUrl        = null;
  /** @member {MQCD} */
  this.ClientConn     = null;
  /** @member {MQSCO} */
  this.SSLConfig      = null;
  Object.seal(this);
};

/*
 * _MQCNOffi_t is the definition directly matching the C structure
 * for the MQCNO so it can be used in the FFI call to the MQI.
 * This is not meant to be used publicly.
 */
var _MQCNOffi_t = StructType({
  StrucId           : MQT.CHAR4 ,
  Version           : MQT.LONG  ,
  Options           : MQT.LONG  ,
  ClientConnOffset  : MQT.LONG  ,
  ClientConnPtr     : MQT.PTR   ,
  ConnTag           : MQT.BYTE128,
  SSLConfigPtr      : MQT.PTR   ,
  SSLConfigOffset   : MQT.LONG  ,
  ConnectionId      : MQT.BYTE24,
  SecurityParmsOffset:MQT.LONG  ,
  SecurityParmsPtr  : MQT.PTR ,
  CCDTUrlPtr        : MQT.PTR   ,
  CCDTUrlOffset     : MQT.LONG  ,
  CCDTUrlLength     : MQT.LONG  ,
  Reserved          : MQT.CHAR8
});

/*
 * This function creates the C structure analogue, and
 * also populates it with the default values.
 */
exports._newMQCNOffi = function() {
  var cno = new _MQCNOffi_t();

  u.setMQIString(cno.StrucId,"CNO ");
  cno.Version           = 1;
  cno.Options           = MQC.MQCNO_NONE;
  cno.ClientConnOffset  = 0;
  cno.ClientConnPtr     = ref.NULL;
  u.fillMQIString(cno.ConnTag,0);
  cno.SSLConfigPtr      = ref.NULL;
  cno.SSLConfigOffset   = 0;
  u.fillMQIString(cno.ConnectionId,0);
  cno.SecurityParmsOffset = 0;
  cno.SecurityParmsPtr  = ref.NULL;
  cno.CCDTUrlPtr        = ref.NULL;
  cno.CCDTUrlOffset     = 0;
  cno.CCDTUrlLength     = 0;
  u.fillMQIString(cno.Reserved,0);

  return cno;
};

exports._copyCNOtoC = function(jscno) {

  var mqcno = exports._newMQCNOffi();
  mqcno.Options          = jscno.Options;

  // If a channel definition is provided, attach it to the CNO.
  var jscd =  jscno.ClientConn;
  if (jscd != null) {
    if (!(jscd instanceof MQCD.MQCD)) {
      throw new TypeError('Parameter must be of type MQCD');
    }
    var mqcd = MQCD._copyCDtoC(jscd);
    mqcno.ClientConnPtr = mqcd.ref();
    if (mqcno.Version < 2) {
      mqcno.Version = 2;
    }
  }

  // If SSL/TLS options are provided, attach them to the CNO.
  var jssco =  jscno.SSLConfig;
  if (jssco != null) {
    if (!(jssco instanceof MQSCO.MQSCO)) {
      throw new TypeError('Parameter must be of type MQSCO');
    }
    var mqsco = MQSCO._copySCOtoC(jssco);
    mqcno.SSLConfigPtr = mqsco.ref();
    if (mqcno.Version < 4) {
      mqcno.Version = 4;
    }
  }

  // If security options are provided, attach them to the CNO.
  var jscsp =  jscno.SecurityParms;
  if (jscsp != null) {
    if (!(jscsp instanceof MQCSP.MQCSP)) {
      throw new TypeError('Parameter must be of type MQCSP');
    }
    var mqcsp = MQCSP._newMQCSPffi();

    mqcsp.AuthenticationType = jscsp._authenticationType;
    if (jscsp.UserId != null) {
      mqcsp.CSPUserIdPtr = ref.allocCString(jscsp.UserId);
      mqcsp.CSPUserIdOffset = 0;
      mqcsp.CSPUserIdLength = jscsp.UserId.length;
    }
    if (jscsp.Password != null) {
      mqcsp.CSPPasswordPtr  = ref.allocCString(jscsp.Password);
      mqcsp.CSPPasswordOffset = 0;
      mqcsp.CSPPasswordLength = jscsp.Password.length;
    }

    mqcno.SecurityParmsPtr = mqcsp.ref();
    if (mqcno.Version < 5) {
      mqcno.Version = 5;
    }
  }

  if (jscno.CCDTUrl != null) {
    mqcno.CCDTUrlPtr    = ref.allocCString(jscno.CCDTUrl);
    mqcno.CCDTUrlOffset = 0;
    mqcno.CCDTUrlLength = jscno.CCDTUrl.length;
    if (mqcno.Version < 6) {
      mqcno.Version = 6;
    }
  }


  return mqcno;
};

exports._copyCNOfromC = function(mqcno, jscno) {

  if (jscno != null && jscno.jscsp != null) {
    jscno.jscsp.UserId   = null;
    jscno.jscsp.Password = null;
    mqcno.mqcsp.CSPPasswordPtr = ref.NULL_POINTER;
  }

  /* These fields are not exposed in the JS structure so
     do not need to be copied back.
     ...mqcno.ConnTag...
     ...mqcno.ConnectionId...
  */

   if (mqcno.SSLConfigPtr != null && jscno.SSLConfig != null) {
     MQSCO._copySCOfromC(mqcno.SSLConfigPtr,jscno.SSLConfig);
   }
   if (mqcno.ClientConnPtr != null && jscno.ClientConn != null)  {
     MQCD._copyCDfromC(mqcno.ClientConnPtr,jscno.ClientConn);
   }

  return;
};

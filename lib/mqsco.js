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
 * MQSCO is a JavaScript object containing the fields we need for the MQSCO
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

/*
 * This constructor sets all the common fields for the structure.
 */
/**
 * This constructor sets default values for the object.
 * @class
 * @classdesc
 * This is a class containing the fields needed for the MQSCO
 * (MQ SSL/TLS Configuration Options) structure. See the
 * {@link https://www.ibm.com/support/knowledgecenter/en/SSFKSJ_9.0.0/com.ibm.mq.ref.dev.doc/q099820_.htm|MQ Knowledge Center}
 * for more details on the usage of each field.
 */
exports.MQSCO  = function() {
  /** @member {String} */
  this.KeyRepository          = null;
  /** @member {String} */
  this.CryptoHardware         = null;
  /** @member {number} */
  this.KeyResetCount          = MQC.MQSCO_RESET_COUNT_DEFAULT;
  /** @member {boolean} */
  this.FipsRequired           = false;
  /** @member {Array} */
  this.EncryptionPolicySuiteB = [
    MQC.MQ_SUITE_B_NONE,          MQC.MQ_SUITE_B_NOT_AVAILABLE,
    MQC.MQ_SUITE_B_NOT_AVAILABLE, MQC.MQ_SUITE_B_NOT_AVAILABLE];
  /** @member {number} */
  this.CertificateValPolicy   = MQC.MQ_CERT_VAL_POLICY_DEFAULT;
  /** @member {String} */
  this.CertificateLabel       = null;
  Object.seal(this);
};

/*
 * _MQSCOffi_t is the definition directly matching the C structure
 * for the MQSCO so it can be used in the FFI call to the MQI.
 * This is not meant to be used publicly.
 */
var _MQSCOffi_t = StructType({
  StrucId           : MQT.CHAR4 ,
  Version           : MQT.LONG  ,
  KeyRepository     : MQT.CHAR256,
  CryptoHardware    : MQT.CHAR256,
  AuthInfoRecCount  : MQT.LONG,
  AuthInfoRecOffset : MQT.LONG,
  AuthInfoRecPtr    : MQT.PTR,
  KeyResetCount     : MQT.LONG,
  FipsRequired      : MQT.LONG,
  EncryptionPolicySuiteB : ArrayType(MQT.LONG,4),
  CertificateValPolicy: MQT.LONG  ,
  CertificateLabel    : MQT.CHAR64
});

/*
 * This function creates the C structure analogue, and
 * also populates it with the default values.
 */
exports._newMQSCOffi = function() {
  var sco = new _MQSCOffi_t();
  var i;

  u.setMQIString(sco.StrucId,"SCO ");
  sco.Version           = 1;
  u.setMQIString(sco.KeyRepository, "");
  u.setMQIString(sco.CryptoHardware, "");
  sco.AuthInfoRecCount  = 0;
  sco.AuthInfoRecOffset = 0;
  sco.AuthInfoRecPtr    = ref.NULL_POINTER;
  sco.KeyResetCount     = MQC.MQSCO_RESET_COUNT_DEFAULT;
  sco.FipsRequired      = MQC.MQSSL_FIPS_NO;
  sco.EncryptionPolicySuiteB[0] = MQC.MQ_SUITE_B_NONE;
  for (i = 1; i<4;i++) {
    sco.EncryptionPolicySuiteB[i] = MQC.MQ_SUITE_B_NOT_AVAILABLE;
  }
  sco.CertificateValPolicy = MQC.MQ_CERT_VAL_POLICY_DEFAULT;
  u.setMQIString(sco.CertificateLabel , "");
  return sco;
};


exports._copySCOtoC = function(jssco) {

  var mqsco = exports._newMQSCOffi();

  u.setMQIString(mqsco.KeyRepository, jssco.KeyRepository);
  u.setMQIString(mqsco.CryptoHardware,jssco.CryptoHardware);
  mqsco.KeyResetCount     = jssco.KeyResetCount;
  mqsco.FipsRequired      = jssco.FipsRequired;
  for (var i = 0;i<4;i++) {
    mqsco.EncryptionPolicySuiteB[i] = jssco.EncryptionPolicySuiteB[i];
  }
  mqsco.CertificateValPolicy = jssco.CertificateValPolicy;
  u.setMQIString(mqsco.CertificateLabel , jssco.CertificateLabel);

  return mqsco;
};

/*
All of the parameters in the MQSCO are input only.
*/
exports._copySCOfromC = function(mqsco, jssco) {
  return;
};


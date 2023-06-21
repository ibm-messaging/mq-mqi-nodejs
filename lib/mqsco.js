'use strict';
/*
  Copyright (c) IBM Corporation 2017, 2023

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
 * MQSCO is a JavaScript object containing the fields we need for the MQSCO
 * in a more idiomatic style than the C definition - in particular for
 * fixed length character buffers.
 */


// Import MQI definitions
var MQC        = require('./mqidefs.js');

/*
 * This constructor sets all the common fields for the structure.
 */
/**
 * This constructor sets default values for the object.
 * @class
 * @classdesc
 * This is a class containing the fields needed for the MQSCO
 * (MQ SSL/TLS Configuration Options) structure. See the
 * {@link https://www.ibm.com/support/knowledgecenter/en/SSFKSJ_latest/com.ibm.mq.ref.dev.doc/q099820_.htm|MQ Knowledge Center}
 * for more details on the usage of each field.
 * Note the warnings in the
 * {@link https://www.ibm.com/support/knowledgecenter/en/SSFKSJ_latest/com.ibm.mq.ref.dev.doc/q095520_.htm|MQ Knowledge Center}
 * about the process-wide, once-only definition of this structure and
 * the MQRC_SSL_ALREADY_INITIALIZED warning reason code.
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
  /** @member {String} */
  this.KeyRepoPassword        = null;
  Object.seal(this);
};

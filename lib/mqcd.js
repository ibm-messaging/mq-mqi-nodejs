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
 * MQCD is a JavaScript object containing the fields we need for the MQ Channel Definition
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
 * This is a class containing the fields needed for the MQCD
 * (MQ Channel Definition) structure. See the
 * {@link https://www.ibm.com/docs/en/ibm-mq/latest?topic=definition-fields|MQ Documentation}
 * for more details on the usage of each field.
 * Not all of the underlying fields may be exposed in this object.
 */
exports.MQCD  = function() {
  /** @member {String} */
  this.ChannelName          = null;
  /** @member {String} */
  this.ConnectionName       = null;
  /** @member {number} */
  this.DiscInterval         = 6000;
  /** @member {String} */
  this.SecurityExit         = null;
  /** @member {String} */
  this.SecurityUserData     = null;
  /** @member {number} */
  this.MaxMsgLength         = 4194304;
  /** @member {number} */
  this.HeartbeatInterval    = 1;
  /** @member {String} */
  this.SSLCipherSpec        = null;
  /** @member {String} */
  this.SSLPeerName          = null;
  /** @member {number} */
  this.SSLClientAuth        = MQC.MQSCA_REQUIRED; // Not used by client, but leave in here for compatibility
  /** @member {number} */
  this.KeepAliveInterval    = -1;
  /** @member {number} */
  this.SharingConversations = 10;
  /** @member {number} */
  this.PropertyControl      = MQC.MQPROP_COMPATIBILITY;
  /** @member {number} */
  this.ClientChannelWeight  = 0;
  /** @member {number} */
  this.ConnectionAffinity   = MQC.MQCAFTY_PREFERRED;
  /** @member {number} */
  this.DefReconnect         = MQC.MQRCN_NO;
  /** @member {String} */
  this.CertificateLabel     = null;
  /** @member {Array} */
  this.HdrCompList          = [MQC.MQCOMPRESS_NONE,MQC.MQCOMPRESS_NOT_AVAILABLE];
  /** @member {Array} */
  this.MsgCompList          = [MQC.MQCOMPRESS_NONE,MQC.MQCOMPRESS_NOT_AVAILABLE, MQC.MQCOMPRESS_NOT_AVAILABLE, MQC.MQCOMPRESS_NOT_AVAILABLE,
                               MQC.MQCOMPRESS_NOT_AVAILABLE,MQC.MQCOMPRESS_NOT_AVAILABLE, MQC.MQCOMPRESS_NOT_AVAILABLE, MQC.MQCOMPRESS_NOT_AVAILABLE,
                               MQC.MQCOMPRESS_NOT_AVAILABLE,MQC.MQCOMPRESS_NOT_AVAILABLE, MQC.MQCOMPRESS_NOT_AVAILABLE, MQC.MQCOMPRESS_NOT_AVAILABLE,
                               MQC.MQCOMPRESS_NOT_AVAILABLE,MQC.MQCOMPRESS_NOT_AVAILABLE, MQC.MQCOMPRESS_NOT_AVAILABLE, MQC.MQCOMPRESS_NOT_AVAILABLE];
  Object.seal(this);
};

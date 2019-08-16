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
 * MQCD is a JavaScript object containing the fields we need for the MQ Channel Definition
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
 * This is a class containing the fields needed for the MQCD
 * (MQ Channel Definition) structure. See the
 * {@link https://www.ibm.com/support/knowledgecenter/en/SSFKSJ_9.0.0/com.ibm.mq.ref.dev.doc/q108220_.htm|MQ Knowledge Center}
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
  this.SSLClientAuth        = MQC.MQSCA_REQUIRED;
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
  Object.seal(this);
};

/*
 * _MQCDffi_t is the definition directly matching the C structure
 * for the MQCD so it can be used in the FFI call to the MQI.
 * This is not meant to be used publicly.
 */
var _MQCDffi_t = StructType({
  ChannelName              : MQT.CHAR20 ,
  Version                  : MQT.LONG   ,
  ChannelType              : MQT.LONG   ,
  TransportType            : MQT.LONG   ,
  Desc                     : MQT.CHAR64 ,
  QMgrName                 : MQT.CHAR48 ,
  XmitQName                : MQT.CHAR48 ,
  ShortConnectionName      : MQT.CHAR20 ,
  MCAName                  : MQT.CHAR20 ,
  ModeName                 : MQT.CHAR8  ,
  TpName                   : MQT.CHAR64 ,
  BatchSize                : MQT.LONG   ,
  DiscInterval             : MQT.LONG   ,
  ShortRetryCount          : MQT.LONG   ,
  ShortRetryInterval       : MQT.LONG   ,
  LongRetryCount           : MQT.LONG   ,
  LongRetryInterval        : MQT.LONG   ,
  SecurityExit             : MQT.CHAR128,
  MsgExit                  : MQT.CHAR128,
  SendExit                 : MQT.CHAR128,
  ReceiveExit              : MQT.CHAR128,
  SeqNumberWrap            : MQT.LONG   ,
  MaxMsgLength             : MQT.LONG   ,
  PutAuthority             : MQT.LONG   ,
  DataConversion           : MQT.LONG   ,
  SecurityUserData         : MQT.CHAR32 ,
  MsgUserData              : MQT.CHAR32 ,
  SendUserData             : MQT.CHAR32 ,
  ReceiveUserData          : MQT.CHAR32 ,
  UserIdentifier           : MQT.CHAR12 ,
  Password                 : MQT.CHAR12 ,
  MCAUserIdentifier        : MQT.CHAR12 ,
  MCAType                  : MQT.LONG   ,
  ConnectionName           : MQT.CHAR264,
  RemoteUserIdentifier     : MQT.CHAR12 ,
  RemotePassword           : MQT.CHAR12 ,
  MsgRetryExit             : MQT.CHAR128,
  MsgRetryUserData         : MQT.CHAR32 ,
  MsgRetryCount            : MQT.LONG   ,
  MsgRetryInterval         : MQT.LONG   ,
  HeartbeatInterval        : MQT.LONG   ,
  BatchInterval            : MQT.LONG   ,
  NonPersistentMsgSpeed    : MQT.LONG   ,
  StrucLength              : MQT.LONG   ,
  ExitNameLength           : MQT.LONG   ,
  ExitDataLength           : MQT.LONG   ,
  MsgExitsDefined          : MQT.LONG   ,
  SendExitsDefined         : MQT.LONG   ,
  ReceiveExitsDefined      : MQT.LONG   ,
  MsgExitPtr               : MQT.PTR    ,
  MsgUserDataPtr           : MQT.PTR    ,
  SendExitPtr              : MQT.PTR    ,
  SendUserDataPtr          : MQT.PTR    ,
  ReceiveExitPtr           : MQT.PTR    ,
  ReceiveUserDataPtr       : MQT.PTR    ,
  ClusterPtr               : MQT.PTR    ,
  ClustersDefined          : MQT.LONG   ,
  NetworkPriority          : MQT.LONG   ,
  LongMCAUserIdLength      : MQT.LONG   ,
  LongRemoteUserIdLength   : MQT.LONG   ,
  LongMCAUserIdPtr         : MQT.PTR    ,
  LongRemoteUserIdPtr      : MQT.PTR    ,
  MCASecurityId            : MQT.BYTE40 ,
  RemoteSecurityId         : MQT.BYTE40 ,
  SSLCipherSpec            : MQT.CHAR32 ,
  SSLPeerNamePtr           : MQT.PTR    ,
  SSLPeerNameLength        : MQT.LONG   ,
  SSLClientAuth            : MQT.LONG   ,
  KeepAliveInterval        : MQT.LONG   ,
  LocalAddress             : MQT.CHAR48 ,
  BatchHeartbeat           : MQT.LONG   ,
  HdrCompList              : ArrayType(MQT.LONG,2) ,
  MsgCompList              : ArrayType(MQT.LONG,16) ,
  CLWLChannelRank          : MQT.LONG   ,
  CLWLChannelPriority      : MQT.LONG   ,
  CLWLChannelWeight        : MQT.LONG   ,
  ChannelMonitoring        : MQT.LONG   ,
  ChannelStatistics        : MQT.LONG   ,
  SharingConversations     : MQT.LONG   ,
  PropertyControl          : MQT.LONG   ,
  MaxInstances             : MQT.LONG   ,
  MaxInstancesPerClient    : MQT.LONG   ,
  ClientChannelWeight      : MQT.LONG   ,
  ConnectionAffinity       : MQT.LONG   ,
  BatchDataLimit           : MQT.LONG   ,
  UseDLQ                   : MQT.LONG   ,
  DefReconnect             : MQT.LONG   ,
  CertificateLabel         : MQT.CHAR64   ,
});

/*
 * This function creates the C structure analogue, and
 * also populates it with the default values.
 */
exports._newMQCDffi = function() {
  var cd = new _MQCDffi_t();
  var i;

  u.setMQIString(cd.ChannelName,"");
  cd.Version           = 11;
  cd.ChannelType   = MQC.MQCHT_CLNTCONN;
  cd.TransportType = MQC.MQXPT_TCP;

  u.setMQIString(cd.Desc               , "");
  u.setMQIString(cd.QMgrName           , "");
  u.setMQIString(cd.XmitQName          , "");
  u.setMQIString(cd.ShortConnectionName, "");
  u.setMQIString(cd.MCAName            , "");
  u.setMQIString(cd.ModeName           , "");
  u.setMQIString(cd.TpName             , "");
  cd.BatchSize           = 50;
  cd.DiscInterval        = 6000;
  cd.ShortRetryCount     = 10;
  cd.ShortRetryInterval  = 60;
  cd.LongRetryCount      = 999999999;
  cd.LongRetryInterval   = 1200;
  u.setMQIString(cd.SecurityExit       , "");
  u.setMQIString(cd.MsgExit            , "");
  u.setMQIString(cd.SendExit           , "");
  u.setMQIString(cd.ReceiveExit        , "");
  cd.SeqNumberWrap       = 999999999;
  cd.MaxMsgLength        = 4194304;
  cd.PutAuthority        = MQC.MQPA_DEFAULT;
  cd.DataConversion      = MQC.MQCDC_NO_DATA_CONVERSION;
  u.setMQIString(cd.SecurityUserData    , "");
  u.setMQIString(cd.MsgUserData         , "");
  u.setMQIString(cd.SendUserData        , "");
  u.setMQIString(cd.ReceiveUserData     , "");
  u.setMQIString(cd.UserIdentifier      , "");
  u.setMQIString(cd.Password            , "");
  u.setMQIString(cd.MCAUserIdentifier   , "");
  cd.MCAType              = MQC.MQMCAT_PROCESS;
  u.setMQIString(cd.ConnectionName       , "");
  u.setMQIString(cd.RemoteUserIdentifier , "");
  u.setMQIString(cd.RemotePassword       , "");
  u.setMQIString(cd.MsgRetryExit         , "");
  u.setMQIString(cd.MsgRetryUserData     , "");
  cd.MsgRetryCount       = 10;
  cd.MsgRetryInterval    = 1000;
  cd.HeartbeatInterval   = 300;
  cd.BatchInterval       = 0;
  cd.NonPersistentMsgSpeed = MQC.MQNPMS_FAST;
  cd.StrucLength         = MQC.MQCD_LENGTH_11; // to match version
  cd.ExitNameLength      = MQC.MQ_EXIT_NAME_LENGTH;
  cd.ExitDataLength      = MQC.MQ_EXIT_DATA_LENGTH;
  cd.MsgExitsDefined     = 0;
  cd.SendExitsDefined    = 0;
  cd.ReceiveExitsDefined = 0;
  cd.MsgExitPtr          = ref.NULL;
  cd.MsgUserDataPtr      = ref.NULL;
  cd.SendExitPtr         = ref.NULL;
  cd.SendUserDataPtr     = ref.NULL;
  cd.ReceiveExitPtr      = ref.NULL;
  cd.ReceiveUserDataPtr  = ref.NULL;
  cd.ClusterPtr          = ref.NULL;
  cd.ClustersDefined     = 0;
  cd.NetworkPriority     = 0;
  cd.LongMCAUserIdLength = 0;
  cd.LongRemoteUserIdLength = 0;
  cd.LongMCAUserIdPtr    = ref.NULL;
  cd.LongRemoteUserIdPtr = ref.NULL;
  u.fillMQIString(cd.MCASecurityId, 0);
  u.fillMQIString(cd.RemoteSecurityId, 0);
  u.setMQIString(cd.SSLCipherSpec, "");
  cd.SSLPeerNamePtr      = ref.NULL;
  cd.SSLPeerNameLength   = 0;
  cd.SSLClientAuth       = MQC.MQSCA_REQUIRED;
  cd.KeepAliveInterval   = MQC.MQKAI_AUTO;
  u.setMQIString(cd.LocalAddress, "");
  cd.BatchHeartbeat      = 0;

  cd.HdrCompList[0] = MQC.MQCOMPRESS_NONE;
  for (i = 1; i < 2; i++) {
      cd.HdrCompList[i] = MQC.MQCOMPRESS_NOT_AVAILABLE;
  }
  cd.MsgCompList[0] = MQC.MQCOMPRESS_NONE;
  for (i = 1; i < 16; i++) {
     cd.MsgCompList[i] = MQC.MQCOMPRESS_NOT_AVAILABLE;
  }
  cd.CLWLChannelRank          = 0;
  cd.CLWLChannelPriority      = 0;
  cd.CLWLChannelWeight        = 50;
  cd.ChannelMonitoring        = MQC.MQMON_OFF;
  cd.ChannelStatistics        = MQC.MQMON_OFF;
  cd.SharingConversations     = 10;
  cd.PropertyControl          = MQC.MQPROP_COMPATIBILITY;
  cd.MaxInstances             = 999999999;
  cd.MaxInstancesPerClient    = 999999999;
  cd.ClientChannelWeight      = 0;
  cd.ConnectionAffinity       = MQC.MQAFTY_PREFERRED;
  cd.BatchDataLimit           = 5000;
  cd.UseDLQ                   = MQC.MQUSEDLQ_YES;
  cd.DefReconnect             = MQC.MQRCN_NO;
  u.setMQIString(cd.CertificateLabel  , "");

  return cd;
};

// Turn host:port into host(port) if necessary
// Many people use the more common format by mistake with MQ and
// are then surprised it doesn't work.
function normaliseConnName(c) {
  var s = c;

  if (c.indexOf(":") >=0) {
    var f = c.split(":");
    if (f.length != 2) {
      throw new TypeError('ConnectionName has incorrect format');
    }
    s = f[0] + "(" + f[1] + ")";
  }

  return s;
}


exports._copyCDtoC = function(jscd) {

  var mqcd = exports._newMQCDffi();

  u.setMQIString(mqcd.ChannelName, jscd.ChannelName);
  u.setMQIString(mqcd.ConnectionName, normaliseConnName(jscd.ConnectionName));
  mqcd.DiscInterval = jscd.DiscInterval;
  u.setMQIString(mqcd.SecurityExit, jscd.SecurityExit);
  u.setMQIString(mqcd.SecurityUserData, jscd.SecurityUserData);
  mqcd.MaxMsgLength = jscd.MaxMsgLength;
  mqcd.HeartbeatInterval = jscd.HeartbeatInterval;
  u.setMQIString(mqcd.SSLCipherSpec, jscd.SSLCipherSpec);
  if (jscd.SSLPeerName != null) {
          mqcd.SSLPeerNamePtr = ref.allocCString(jscd.SSLPeerName);
          mqcd.SSLPeerNameLength = jscd.SSLPeerName.length;
  }
  mqcd.SSLClientAuth = jscd.SSLClientAuth;
  mqcd.KeepAliveInterval = jscd.KeepAliveInterval;
  mqcd.SharingConversations = jscd.SharingConversations;
  mqcd.PropertyControl = jscd.PropertyControl;
  mqcd.ClientChannelWeight = jscd.ClientChannelWeight;
  mqcd.ConnectionAffinity = jscd.ConnectionAffinity;
  mqcd.DefReconnect = jscd.DefReconnect;
  u.setMQIString(mqcd.CertificateLabel, jscd.CertificateLabel);

  return mqcd;
};

/*
All of the parameters in the MQCD are input only.
*/
exports._copyCDfromC = function(mqcd, jscd) {
  return;
};

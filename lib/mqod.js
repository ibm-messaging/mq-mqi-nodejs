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

// Import packages for handling structures
var ref        = require('ref');
var StructType = require('ref-struct');
var ArrayType  = require('ref-array');

// Import MQI definitions
var MQC        = require('./mqidefs.js');
var MQT        = require('./mqitypes.js');
var u          = require('./mqiutils.js');

/*
MQOD is a JavaScript object containing the fields we need for the MQOD
in a more idiomatic style than the C definition - in particular for
fixed length character buffers.

This constructor sets all the common fields for the structure.
*/
exports.MQOD = function() {
  this.ObjectType     = MQC.MQOT_Q;
  this.ObjectName     = null;
  this.ObjectQMgrName = null;
  this.DynamicQName   = "AMQ.*";
  this.AlternateUserId= null;

/*
Not going to deal with Distribution lists - pub/sub is the recommended way to
work with multiple destinations
  this.RecsPresent = 0;
  this.KnownDestCount = 0;
  this.UnknownDestCount = 0;
  this.InvalidDestCount = 0;
  this.ObjectRecOffset = 0;
  this.ResponseRecOffset = 0;
*/

  this.AlternateSecurityId = Buffer.alloc(MQC.MQ_SECURITY_ID_LENGTH);
  this.ResolvedQName = null;
  this.ResolvedQMgrName = null;

  this.ObjectString = null;
  this.SelectionString = null;
  this.ResObjectString = null;
  this.ResolvedType = MQC.MQOT_NONE;
  Object.seal(this);
};


/*
 * _MQODffi_t is the definition directly matching the C structure
 * for the MQOD so it can be used in the FFI call to the MQI.
 * This is not meant to be used publicly.
 */
var _MQODffi_t = StructType({
  StrucId            : MQT.CHAR4       ,
  Version            : ref.types.int32 ,
  ObjectType         : ref.types.int32 ,
  ObjectName         : MQT.CHAR48      ,
  ObjectQMgrName     : MQT.CHAR48      ,
  DynamicQName       : MQT.CHAR48      ,
  AlternateUserId    : MQT.CHAR12      ,

  RecsPresent        : ref.types.int32 ,
  KnownDestCount     : ref.types.int32 ,
  UnknownDestCount   : ref.types.int32 ,
  InvalidDestCount   : ref.types.int32 ,
  ObjectRecOffset    : ref.types.int32 ,
  ResponseRecOffset  : ref.types.int32 ,

  ObjectRecPtr       : MQT.PTR         ,
  ResponseRecPtr     : MQT.PTR         ,

  AlternateSecurityId: MQT.CHAR40      ,
  ResolvedQName      : MQT.CHAR48      ,
  ResolvedQMgrName   : MQT.CHAR48      ,

  ObjectString      : MQT.CHARV        ,
  SelectionString   : MQT.CHARV        ,
  ResObjectString   : MQT.CHARV        ,
  ResolvedType      : ref.types.int32

});

/*
 * This function creates the C structure analogue, and
 * populates it with default values.
 */
exports._newMQODffi = function() {
  var od = new _MQODffi_t();

  u.setMQIString(od.StrucId,"OD  ");
  od.Version = 4;
  od.ObjectType = MQC.MQOT_Q;
  u.setMQIString(od.ObjectName,"");
  u.setMQIString(od.ObjectQMgrName,"");
  u.setMQIString(od.DynamicQName,"AMQ.*");
  u.setMQIString(od.AlternateUserId, "");

  od.RecsPresent = 0;
  od.KnownDestCount = 0;
  od.UnknownDestCount = 0;
  od.InvalidDestCount = 0;
  od.ObjectRecOffset = 0;
  od.ResponseRecOffset = 0;

  od.ObjectRecPtr = ref.NULL;
  od.ResponseRecPtr = ref.NULL;

  u.fillMQIString(od.AlternateSecurityId,0);
  u.setMQIString(od.ResolvedQName,"");
  u.setMQIString(od.ResolvedQMgrName, "");

  u.defaultCharV(od.ObjectString);
  u.defaultCharV(od.SelectionString);
  u.defaultCharV(od.ResObjectString);
  od.ResolvedType = MQC.MQOT_NONE;

  return od;
};

exports._copyODtoC = function(jsod) {
  var mqod = exports._newMQODffi();
  var i;

  mqod.Version = 4; // We will always use this version.
  mqod.ObjectType = jsod.ObjectType;
  u.setMQIString(mqod.ObjectName,jsod.ObjectName);
  u.setMQIString(mqod.ObjectQMgrName,jsod.ObjectQMgrName);

  u.setMQIString(mqod.DynamicQName, jsod.DynamicQName);
  u.setMQIString(mqod.AlternateUserId, jsod.AlternateUserId);

  for (i = 0; i < MQC.MQ_SECURITY_ID_LENGTH && i < jsod.AlternateSecurityId.length; i++) {
    mqod.AlternateSecurityId[i] = jsod.AlternateSecurityId[i];
  }

  u.setMQICharV(mqod.ObjectString, jsod.ObjectString);
  u.setMQICharV(mqod.SelectionString, jsod.SelectionString, true);
  u.setMQICharV(mqod.ResObjectString, jsod.ResObjectString, true);

  mqod.ResolvedType = jsod.ResolvedType;

  return mqod;
};

exports._copyODfromC = function(mqod,jsod) {
  var i;
  jsod.ObjectType = mqod.ObjectType;
  jsod.ObjectName = u.getMQIString(mqod.ObjectName);
  jsod.ObjectQMgrName = u.getMQIString(mqod.ObjectQMgrName);
  jsod.DynamicQName = u.getMQIString(mqod.DynamicQName);
  jsod.AlternateUserId = u.getMQIString(mqod.AlternateUserId);

  for (i = 0; i < MQC.MQ_SECURITY_ID_LENGTH; i++) {
    jsod.AlternateSecurityId[i] = mqod.AlternateSecurityId[i];
  }

  jsod.ResolvedQName = u.getMQIString(mqod.ResolvedQName);
  jsod.ResolvedQMgrName = u.getMQIString(mqod.ResolvedQMgrName);

  jsod.ResolvedType = mqod.ResolvedType;
  jsod.ObjectString = u.getMQICharV(mqod.ObjectString);
  jsod.SelectionString = u.getMQICharV(mqod.SelectionString);
  jsod.ResObjectString = u.getMQICharV(mqod.ResObjectString);

  return jsod;
};

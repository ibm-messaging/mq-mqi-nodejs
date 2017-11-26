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

// Also need the MQCSP structure which is used in the MQCNO
// TODO: Add the other referenced structures MQSCO, MQCD
var MQCSP      = require('./mqcsp.js');

/*
 * This constructor sets all the common fields for the structure.
 */
exports.MQCNO  = function() {
  this.Options        = MQC.MQCNO_NONE;
  this.SecurityParms  = null;
  //this.CCDTUrl        = null;
  //this.ClientConn     = null;
  //this.SSLConfig      = null;
  Object.seal(this);
}

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
  var cno = new _MQCNOffi_t()

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
  cno.SecurityParmsPtr  = ref.NULL_POINTER;
  cno.CCDTUrlPtr        = ref.NULL_POINTER;
  cno.CCDTUrlOffset     = 0;
  cno.CCDTUrlLength     = 0;
  u.fillMQIString(cno.Reserved,0);

  return cno;
}

exports._copyCNOtoC = function(jscno) {

  var mqcno = exports._newMQCNOffi();
  mqcno.Options          = jscno.Options;

  // If security options are provided, attach them to
  // the CNO.
  var jscsp =  jscno.SecurityParms;
  if (jscsp != null) {
    const mqcsp = MQCSP._newMQCSPffi();

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

  // TODO: Add the other fields for the CNO
  // ClientConnPtr (which in turn will require MQCD structure)
  // SSLConfigPtr (which will need MQSCO structure)
  // CCDTUrlPtr

  return mqcno;
}

exports._copyCNOfromC = function(mqcno, jscno) {

  if (jscno != null && jscno.jscsp != null) {
    jscno.jscp.UserId   = null;
    jscno.jscp.Password = null;
  }

  /* These fields are not exposed in the JS structure so
     do not need to be copied back.
     ...mqcno.ConnTag...
     ...mqcno.ConnectionId...
  */

  /*
   TODO: See which fields are returned from the MQCONNX for the
   other currently-unsupported structures
   */

  return;
}

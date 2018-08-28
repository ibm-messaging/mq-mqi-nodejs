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
 * This module defines basic MQI types that will be used when
 * constructing the buffer structures to be passed across the FFI.
 */

// Import packages for handling structures
var ref        = require('ref');
var StructType = require('ref-struct');
var ArrayType  = require('ref-array');

exports.CHAR    = ref.types.char;
exports.BYTE    = ref.types.uchar;
exports.CHAR4   = ArrayType(exports.CHAR,4);
exports.CHAR8   = ArrayType(exports.CHAR,8);
exports.CHAR12  = ArrayType(exports.CHAR,12);
exports.CHAR20  = ArrayType(exports.CHAR,20);
exports.CHAR28  = ArrayType(exports.CHAR,28);
exports.CHAR32  = ArrayType(exports.CHAR,32);
exports.CHAR40  = ArrayType(exports.CHAR,40);
exports.CHAR48  = ArrayType(exports.CHAR,48);
exports.CHAR64  = ArrayType(exports.CHAR,64);
exports.CHAR128 = ArrayType(exports.CHAR,128);
exports.CHAR256 = ArrayType(exports.CHAR,256);
exports.CHAR264 = ArrayType(exports.CHAR,264);

exports.BYTE4   = ArrayType(exports.BYTE,4);
exports.BYTE8   = ArrayType(exports.BYTE,8);
exports.BYTE16  = ArrayType(exports.BYTE,16);
exports.BYTE24  = ArrayType(exports.BYTE,24);
exports.BYTE40  = ArrayType(exports.BYTE,40);
exports.BYTE32  = ArrayType(exports.BYTE,32);
exports.BYTE128 = ArrayType(exports.BYTE,128);
exports.PTR     = ref.refType(ref.types.void);

exports.HCONN = ref.types.int32;
exports.HOBJ  = ref.types.int32;
exports.HMSG   = ref.types.int64;
exports.LONG = ref.types.int32;
exports.INT64  = ref.types.int64;

var MQMD=require('./mqmd.js');
var MQGMO=require('./mqgmo.js');
var MQCBC=require('./mqcbc.js');

// A few of these datatypes have to be
// explicit as they are used in MQCB callbacks.
// I didn't set up all of the others for now as it
// wasn't absolutely necessary.
//
// TODO: restructure the various definitions and
// modules so there's not so much exporting and
// duplicating going on.
exports.OD = ref.types.void;
exports.MD = MQMD._MQMDffi_t;
exports.PMO = ref.types.void;
exports.GMO = MQGMO._MQGMOffi_t;
exports.CNO = ref.types.void;
exports.CSP = ref.types.void;
exports.SCO = ref.types.void;
exports.SRO = ref.types.void;
exports.STS = ref.types.void;
exports.SD = ref.types.void;
exports.CTLO = ref.types.void;
exports.CBD = ref.types.void;
exports.CBC = MQCBC._MQCBCffi_t;
exports.CMHO = ref.types.void;
exports.DMHO = ref.types.void;
exports.IMPO = ref.types.void;
exports.SMPO = ref.types.void;
exports.DMPO = ref.types.void;
exports.PD   = ref.types.void;

exports.PHCONN = ref.refType(exports.HCONN);
exports.PHOBJ = ref.refType(exports.HOBJ);
exports.PLONG = ref.refType(exports.LONG);
exports.PHMSG = ref.refType(exports.HMSG);

exports.POD = ref.refType(exports.OD);
exports.PSD = ref.refType(exports.SD);
exports.PMD = ref.refType(exports.MD);
exports.PPMO = ref.refType(exports.PMO);
exports.PGMO = ref.refType(exports.GMO);
exports.PCNO = ref.refType(exports.CNO);
exports.PCSP = ref.refType(exports.CSP);
exports.PSCO = ref.refType(exports.SCO);
exports.PSRO = ref.refType(exports.SRO);
exports.PSTS = ref.refType(exports.STS);
exports.PCTLO = ref.refType(exports.CTLO);
exports.PCBD = ref.refType(exports.CBD);
exports.PCBC = ref.refType(exports.CBC);
exports.PCMHO = ref.refType(exports.CMHO);
exports.PDMHO = ref.refType(exports.DMHO);
exports.PIMPO = ref.refType(exports.IMPO);
exports.PSMPO = ref.refType(exports.SMPO);
exports.PDMPO = ref.refType(exports.DMPO);
exports.PPD   = ref.refType(exports.PD);

exports.CHARV = StructType({
  VSPtr    : ref.refType(ref.types.void),
  VSOffset : ref.types.int32,
  VSBufSize: ref.types.int32,
  VSLength : ref.types.int32,
  VSCCSID  : ref.types.int32
});

exports.PCHARV = ref.refType(exports.CHARV);

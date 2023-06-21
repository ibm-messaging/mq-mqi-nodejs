'use strict';

/*
  Copyright (c) IBM Corporation 2023

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

const MQC=require('./mqidefs.js');

const le = ((MQC.MQENC_NATIVE & MQC.MQENC_INTEGER_MASK) == MQC.MQENC_INTEGER_REVERSED);
const ptrLen = (process.arch == "arm" || process.arch == "ia32") ? 4:8;

exports.bufNewWriteInt32 = function(buf,offsetMap,field,val,o) {
  offsetMap[field] = o.offset;
  o.offset +=exports.bufWriteInt32(buf,val,o.offset);
};

exports.bufNewWriteInt64 = function(buf,offsetMap,field,val,o) {
  offsetMap[field] = o.offset;
  o.offset += exports.bufWriteInt64(buf,val,o.offset);
};

exports.bufNewWriteString = function(buf,offsetMap,field,val,len,o) {
  offsetMap[field] = o.offset;
  o.offset +=exports.bufWriteString(buf,val,len,o.offset);
};

exports.bufNewWriteChar = function(buf,offsetMap,field,val,o) {
  offsetMap[field] = o.offset;
  o.offset +=exports.bufWriteChar(buf,val,o.offset);
};

exports.bufNewFill = function(buf,offsetMap,field,val,len,o) {
  offsetMap[field] = o.offset;
  o.offset +=exports.bufFill(buf,val,len,o.offset);
};

exports.bufNewWriteNullPtr = function(buf,offsetMap,field,o) {
  offsetMap[field] = o.offset;
  o.offset += exports.bufFill(buf,0,ptrLen,o.offset);
};

/********************************************************************** */
exports.bufWriteInt32 = function(buf,val,offset) {
  if (le) 
    buf.writeInt32LE(val,offset);
  else  
    buf.writeInt32BE(val,offset);
  return 4;
};

exports.bufWriteInt64 = function(buf,val,offset) {
  if (le) 
    buf.writeBigInt64LE(BigInt(val),offset);
  else  
    buf.writeBigInt64BE(BigInt(val),offset);
  return 8;
};

exports.bufWriteString = function(buf,val,len,offset) {
  var i = 0;
  if (val != null) {
    for (i=0 ; (i < val.length) && (i < len); i++) {
       if (typeof(val) === 'string')
         buf[offset+i] = val.charCodeAt(i);
       else
         buf[offset+i] = val[i];
      }
  }
  for (i; i < len; i++) {
     buf[offset+i] = 0x20;
  }
  return len;
};

exports.bufWriteChar = function(buf,val,offset) {
  buf[offset] = val;
  return 1;
};


exports.bufFill = function(buf,val,len,offset) {
  buf.fill(val,offset,len);
  return len;
};

/********************************************************************** */

exports.bufReadInt32 = function(buf,offset) {
  if (le) 
    return buf.readInt32LE(offset);
  else  
    return buf.readInt32BE(offset);
};

exports.bufReadInt64 = function(buf,offset) {
  if (le) 
    return buf.readBigInt64LE(offset);
  else  
    return buf.readBigInt64BE(offset);
};

exports.bufReadString = function(buf,len,offset) {
  var s =  buf.toString('utf8',offset,offset+len);
  s = s.trim();
  return s;
};

exports.bufReadChar = function(buf,offset) {
  var c =  buf[offset];
  return String.fromCharCode(c).charAt(0);
};

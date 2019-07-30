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
 * Various utility functions that may be needed in
 * the different MQI operations
 *
 * TODO: How much error checking can/should we do on parameters. For example
 *       if buf.length is undefined, then throw exception?
 */

var ref = require('ref-napi');
var MQC = require('./mqidefs.js');

/*
 * setMQIString fills in a fixed length buffer from a string, and pads with
 * spaces. Input string may be null, in which case the whole field is padded.
 *
 * Throws a RangeError if the input string is too long for the
 * available buffer and the truncate parameter is not set or is false
 *
 * TODO: Are there times when the input string may be multi-byte?
 */
exports.setMQIString = function(buf,str, truncate)  {
  var i = 0;
  if (str != null) {
    if (str.length > buf.length && !truncate) {
      var errstring = 'Input string is too long for MQI field';
      throw new RangeError(errstring);
    }

    for (i=0 ; (i < str.length) && (i < buf.length); i++) {
       buf[i] = str[i];
      }
  }
  for (i; i < buf.length; i++) {
     buf[i] = ' ';
  }
  return buf;
};

/*
 * fillMQIString sets a fixed length buffer to the specified character or byte
 */
exports.fillMQIString = function(buf, c)  {
  for (var i=0; i < buf.length; i++) {
     buf[i] = c;
  }
  return buf;
};

/*
 * getMQIString constructs a trimmed string from a fixed length MQI area
 */
exports.getMQIString = function(buf) {
  var s =  String.fromCharCode.apply(null,buf);
  if (s.length == 0)
    return null;
  else
    return trimNulls(s.trim());
};

function trimNulls(s) {
  var c = s.indexOf('\0');
  if (c>=0) {
    var s2 = s.substr(s,c);
    if (s2.length == 0) {
      return null;
    } else {
      return s2;
    }
  }
  return s;
}

exports.defaultCharV = function(c) {
  c.VSPtr = ref.NULL;
  c.VSOffset = 0;
  c.VSBufSize = 0;
  c.VSLength = 0 ;
  c.VSCCSID = MQC.MQCCSI_APPL;
};

/*
 * Set a string into the CHARV structure. Assume it
 * is in codepage 1208. If there is no
 * input string, then optionally create a large buffer
 * that can be used for returned values ("output"
 * variable is set to true).
 */
exports.setMQICharV = function(c,str, output) {
  const bufsize = 10240;
  const largeBuf="                                                   ";
  var p = ref.NULL;
  if (str) {
    p = Buffer.from(str + '\u0000','utf-8');
    c.VSPtr = p;
    c.VSBufSize = p.length;
    c.VSLength = p.length-1;
  } else {
    if (output) {
      p = Buffer.alloc(bufsize);
      c.VSPtr = p; //ref.ref(p);
      c.VSBufSize = p.length;
      c.VSLength = 0;
    }
  }
};

exports.getMQICharV = function(c) {
  if (c && c.VSPtr && c.VSLength > 0) {
    var s = ref.reinterpret(c.VSPtr,c.VSLength,'utf8');
    c.VSPtr = ref.NULL; // encourage GC to reclaim buffer
    return s;
  } else {
    c.VSPtr = ref.NULL;
    c.VSLength = 0;
    c.VSBufSize = 0;
    return null;
  }
};

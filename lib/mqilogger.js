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
    Mark Taylor   - Initial Contribution
   
*/

/*
 * A simple console printer to allow debug statements to be sprinkled in here
 * while adding timestamps. Can be enabled either via a TuningParameters setting
 * or with the MQIJS_DEBUG environment variable.
 */

const util=require('util');
const mqnapi = require('../build/Release/ibmmq_native');

const padding32 = " ".repeat(32);

exports.debugEnabled = null;
function debug(fmt,...args) {
  if (exports.debugEnabled == null) {
    if (process.env['MQIJS_DEBUG'] != null || exports.traceEnabled) {
      exports.debugEnabled = true;
    } else {
      exports.debugEnabled = false;
    }
  }
  if (exports.debugEnabled) {
    // Not really an error, but we print to stderr
    const l = util.format("[ibmmq] %s : " + fmt,new Date().toISOString(),...args);
    console.error(l);
  }
}
exports.debug = debug;

/*
 * Tracing is managed similarly, but separately
*/
exports.traceEnabled = null;
function trace (fn,inout,fmt,...args) {
  if (exports.traceEnabled == null) {
    if (process.env['MQIJS_TRACE'] != null) {
        exports.traceEnabled = true;
        exports.debugEnabled = true; // Force debug logging on as well
    } else {
        exports.traceEnabled = false;
    }
  }
  if (exports.traceEnabled) {
    if (!fmt) {
      fmt="";
    }
    const l = util.format("[ibmmq] %s : %s " + fmt,new Date().toISOString(),traceFormatFn(inout,fn),...args);
    console.error(l);
  }
}
exports.trace = trace;

/*
* The fmt and args parameters to these functions are optional. 
*/
exports.traceEntry = function(fn,fmt,...args) {
    trace(fn,">",fmt,...args);
};
exports.traceExit = function(fn,fmt,...args) {
    trace(fn,"<",fmt,...args);
};
exports.traceExitErr = function(fn,err)  {
    trace(fn,"<","err:%o",err.message?err.message:err);
};

/* Format function names in a consistent way, with entry/exit markers
 */
function traceFormatFn(inout,fn) {
  if (!inout) {
    inout=" ";
  }  
  // Longest function name we might want to trace is currently 21 chars long 
  return inout + " [" + (fn + padding32).substring(0,22) + "]";
}


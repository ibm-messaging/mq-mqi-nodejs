'use strict';
/*
  Copyright (c) IBM Corporation 2017,2023

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
 */
const util = require('util');

const MQC = require('./mqidefs.js');
const log = require('./mqilogger.js');
const mqistrings = require('./mqistrings.js');

var packageVersion = "Unknown";
try {
  packageVersion = require('../package.json').version;
} catch (err) {
}

/**
 * MQQueueManager contains the connection to the queue manager. Fields
 * in this object are not meant to be directly referenced by user applications..
 * @class
 */
function MQQueueManager(hConn, name) {
  this._hConn = hConn;
  this._name = name;
  Object.seal(this);
}
exports.MQQueueManager = MQQueueManager;

/**
 * MQObject contains a reference to an open object and the associated
 * queue manager. Fields in this object are not meant to be directly referenced
 * by user applications. Combining hConn and hObj in a single object means
 * we can simplify the API.
 * @class
 */
function MQObject(hObj, mqQueueManager, name) {
  this._hObj = hObj;
  this._mqQueueManager = mqQueueManager; // enables access to the hConn
  if (name != null) {
    this._name = name.toString();
  } else {
    this._name = "<<unknown>>";
  }
  Object.seal(this);
}
exports.MQObject = MQObject;


/**
 * MQAttr contains information about object attributes used in Set (MQSET)
 * and Inq (MQINQ) operations.
 * @class
 */
function MQAttr(selector, value) {
  /** The MQIA/MQCA selector value. For example MQIA_INHIBIT_PUT
  @member {number}
  */
  this.selector = selector;
  /**
  The "value" is optional in the constructor when making Inq() calls.
  @member {Object}
  */
  this.value = value;
  this._length = 0;
  Object.seal(this);
}
exports.MQAttr = MQAttr;

/**
 * MQError holds the MQRC and MQCC values returned from an MQI verb.
 * For convenience, it also holds the name of the verb that failed.
 * It is a subclass of Error(). A pre-formatted error message is available
 * from this class, but individual fields are also accessible for applications that
 * want to handle errors fully themselves.
 * @class
 * @implements {Error}
 */
class MQError extends Error {
  constructor(mqcc, mqrc, verb) {
    // Standard setting up for Error objects
    super();
    Error.call(this);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;

    // Find the strings corresponding to MQRC/MCC numbers
    var mqrcstr = exports.Lookup('MQRC', mqrc);
    if (!mqrcstr)
      mqrcstr = exports.Lookup('MQRCCF', mqrc);
    if (!mqrcstr)
      mqrcstr = "Unknown";
    var mqccstr = exports.Lookup('MQCC', mqcc);
    if (!mqccstr)
      mqccstr = "Unknown";
    this.message = util.format("%s: MQCC = %s [%d] MQRC = %s [%d]", verb, mqccstr, mqcc, mqrcstr, mqrc);
    // Add custom fields for direct access
    /** @member {number} */
    this.mqcc = mqcc;
    /** @member {String} */
    this.mqccstr = mqccstr;
    /** @member {number} */
    this.mqrc = mqrc;
    /** @member {String} */
    this.mqrcstr = mqrcstr;
    /** @member {String} */
    this.version = packageVersion;
    /** @member {String} */
    this.verb = verb; // A string such as "PUT" or "CMIT"
    Object.seal(this);
    log.trace('MQError', null, "%s", this.message);
  }
}
exports.MQError = MQError;

/* Convert an array of MQI constants such as [MQGMO_CONVERT,MQGMO_WAIT] into
 * the corresponding single integer. 
 *   f : string naming the field that's being converted eg 'Gmo.Options'. Useful for debug
 *   o : Object containing the array or integer
 * Returns:
 *   either the number as-is or the array contents ORed together
 */
exports.flagsToNumber = function(f,o) {
  var rc = 0;
  var i;
  var v;
  var err = new TypeError('Invalid type for field ' + f);

  if (Array.isArray(o)) {
    for (i=0;i<o.length;i++) {
      v = o[i];
      if (typeof(v) === 'number') {
        rc=rc | v;
      } else {
        throw err;
      }
    }
  } else if (typeof(o) === 'number') {
    rc=o;
  } else {
    throw err;
  }
  return rc;
};

/*
 * Reverses the previous function, based on whether the original input was
 * an array or not. You can then test if a flag is set in the response using 
 * something like 
 *    if val.includes(flag) ...
 * though that will not show any flag that has the value of 0
 */
exports.flagsFromNumber = function(f,origFormat,val) {
  if (origFormat == null) {
    return val;
  }
  if (Array.isArray(origFormat)) {
    var newArray=[];
    var i;
    for (i=0;i<32;i++) {
      var bit = 1 << i;
      if (val & bit) {
        newArray.push(bit);
      }
    }
    return newArray;
  } else {
    return val;
  }
};

/*
* Check that the callback parameter (if supplied) is valid.
* Throw an exception if it is not.
*/
exports.checkParamCBRequired = function(cb, required) {
  var err;
  log.traceEntry('checkParamCBRequired', "req=%o", required);
  if (required && cb == null) {
    err = new TypeError('Callback function must be provided');
    log.traceExitErr('checkParamCBRequired', err);
    throw err;
  }
  if (cb && (typeof cb !== 'function')) {
    err = new TypeError('Callback must be a function');
    log.traceExitErr('checkParamCBRequired', err);
    throw err;
  }
  log.traceExit('checkParamCBRequired');
};

exports.checkParamCB = function(cb) {
  exports.checkParamCBRequired(cb, false);
};

/*
 * Generic type checkers for MQI parameters passed from user applications.
 * @param {Object} b - object to check
 * @param {Type} t - expected type
 * @param {String} m - type shown in error
 * @param {boolean} required - if true, object b must not be null.
 * @throws {TypeError}
 */
exports.checkParamRequired = function(b, t, m, required) {
  if (required && b == null) {
    throw new TypeError('Parameter of type ' + m + ' must be provided');
  }
  if (!required && b == null) {
    return;
  }

  // Handle basic types first
  if (t == 'number' || t == 'string' || t == 'boolean') {
    if (typeof b !== t) {
      throw new TypeError('Parameter must be of type ' + m);
    } else {
      return;
    }
  }
  // And then check for Object classes
  if (b && !(b instanceof t)) {
    throw new TypeError('Parameter must be of type ' + m);
  }
};

exports.checkParam = function(b, t, m, o) {
  if (o != null) {
    exports.checkParamRequired(b, t, m, o);
  } else {
    exports.checkParamRequired(b, t, m, true);
  }
};

// If a value has been passed as an array, let it through. Otherwise do the 
// usual check
exports.checkParamArray = function(b, t, m, o) {
  if (!Array.isArray(b)) {
    exports.checkParam(b, t, m, o);
  }
};

exports.checkArray = function(o) {
  var rc = (!!o) && (o.constructor === Array);
  if (!rc) {
    throw new TypeError('Parameter must be an Array');
  }
  return rc;
};

/**
 * Lookup returns the string corresponding to a value. For example,
 * convert 2195 to MQRC_UNEXPECTED_ERROR.
 *
 * <p>Note: Unlike the Java equivalent, this does not accept regular expressions
 * for the range. It must be an explicit value.
 *
 * @param {String}
 *        range - eg "MQRC" or "MQIA"
 * @param {int}
 *        value - the value to convert
 * @return {String} The string or null if no matching value or range.
 *
 */
exports.Lookup = function (range, val) {
  var f = range + "_STR";
  try {
    var x = mqistrings[f](val);
    return x;
  } catch (e) {
    return null;
  }
};
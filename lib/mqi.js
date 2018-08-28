'use strict';
/*
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific

*/

/**
 * @module ibmmq
 * @license Apache License Version 2.0
 * @overview
 * This package exposes the IBM MQ programming interface via
 * a (hopefully) JavaScript-friendly wrapper layer. This should make it
 * easy for a Node.js developer to send and receive messages via MQ, and
 * interact with other MQ-enabled applications in the organisation.
 *
 * The key verbs and parameters are implemented here. Where there
 * are missing details, these are shown by TODO in the source code.
 *
 * <p>The package is based on exposing the full MQI. It uses essentially the
 * same verbs and structures as the C or COBOL interface, but with a more
 * natural syntax, removing the need for a JavaScript developer to worry about
 * how to map to the native C libraries.
 * <p>This contrasts with the MQ Light API and MQTT interface
 * that are also available for Node.js, but are tied to a publish/subscribe
 * messaging model. MQ V9.0.4 also incorporates a simple REST API for direct access to
 * the messaging service, but that too does not give the full flexibility of
 * the MQI.
 *
 * <p>The verbs implemented here invoke
 * user-supplied callback functions on completion. In all cases, the callbacks
 * are presented with an MQError object as the first parameter when an error
 * or warning occurs (null otherwise), followed by other relevant
 * objects and data. Callbacks are optional in most verbs. If not supplied, then errors are
 * delivered via exception and other responses are the return value from the
 * function. Where multiple items need to be returned to the caller, a callback function is
 * mandatory.
 *
 * <p>All structures are marked as sealed, so that application errors in spelling
 * field names are rejected.
 *
 * <p>Sample programs are included with the package to demonstrate how to use it.
 * See {@link https://developer.ibm.com/messaging/2017/11/10/ibm-mq-node-js/|here} for
 * more discussion of the interface.
 *
 * @author Mark Taylor
 * @copyright Copyright (c) IBM Corporation 2017, 2018
 */

// Import external packages for handling structures and calling C libraries
var ref = require('ref');
var ffi = require('ffi');
var StructType = require('ref-struct');
var ArrayType = require('ref-array');


var util = require('util');
var path = require('path');

/*
 * Get some basic definitions. The constants (MQC) will be
 * re-exported for users of this module. The types (MQT) are not
 * exported as they should not be used by anyone else directly.
 */
var MQC = require('./mqidefs.js');
exports.MQC = MQC;
var MQT = require('./mqitypes.js');
var mqistrings = require('./mqistrings.js');

var mqLongArray = ArrayType(MQT.LONG);

/*
 * Some padding blocks that may be needed
 */
var padding16 = "                ";
var padding64 = padding16 + padding16 + padding16 + padding16 +  padding16;
var padding256 = padding64 + padding64 + padding64 + padding64;

// Maximum message length is 100MB
const maxBufSize = 100 * 1024 * 1024;
const defaultBufSize = 10240;
/*
 * A few utilities to do type conversions such as string to padded MQCHARxx
 * and back again
 */
var u   = require('./mqiutils.js');

var packageVersion = "Unknown";
try  {
  packageVersion = require('../package.json').version;
} catch (err) {
}

/*
 * And start to refer to specific types that are re-exported from here with
 * just the structure definition exposed for external reference.
 */
var MQMD = require('./mqmd.js');
exports.MQMD = MQMD.MQMD;
var MQOD = require('./mqod.js');
exports.MQOD = MQOD.MQOD;
var MQSD = require('./mqsd.js');
exports.MQSD = MQSD.MQSD;
var MQPMO = require('./mqpmo.js');
exports.MQPMO = MQPMO.MQPMO;
var MQGMO = require('./mqgmo.js');
exports.MQGMO = MQGMO.MQGMO;
var MQCNO = require('./mqcno.js');
exports.MQCNO = MQCNO.MQCNO;
var MQSCO = require('./mqsco.js');
exports.MQSCO = MQSCO.MQSCO;
var MQCD  = require('./mqcd.js');
exports.MQCD  = MQCD.MQCD;
var MQCSP = require('./mqcsp.js');
exports.MQCSP = MQCSP.MQCSP;
var MQCBC = require('./mqcbc.js');
exports.MQCBC = MQCBC.MQCBC;
var MQCBD = require('./mqcbd.js');
exports.MQCBD = MQCBD.MQCBD;
var MQCTLO = require('./mqctlo.js');
exports.MQCTLO = MQCTLO.MQCTLO;
var MQSRO = require('./mqsro.js');
exports.MQSRO = MQSRO.MQSRO;
var MQSTS = require('./mqsts.js');
exports.MQSTS = MQSTS.MQSTS;

var MQDLH = require('./mqdlh.js');
exports.MQDLH = MQDLH.MQDLH;

/* Export the message property APIs and structures that are
 * exposed from the mqprop module
 */
var MQMHO = require('./mqmho.js');
var MQMPO = require('./mqmpo.js');

exports.MQCMHO = MQMHO.MQCMHO;
exports.MQDMHO = MQMHO.MQDMHO;
exports.MQIMPO = MQMPO.MQIMPO;
exports.MQSMPO = MQMPO.MQSMPO;
exports.MQDMPO = MQMPO.MQDMPO;
exports.MQPD   = MQMPO.MQPD;

/*
 * This is where we give the function prototypes for the
 * C MQI verbs which are called via the Foreign Function
 * Interface. Have to give the verb name, its return datatype,
 * and the parameter datatypes.
 */
var libmqm;

function loadLib(dir,name) {
  var libname;
  if (dir) {
    libname = path.join(dir,name);
  } else {
    libname = name;
  }
  try {
    libmqm = ffi.Library(libname, {
      'MQCONNX': ['void', ['pointer', MQT.PHCONN, MQT.PCNO, MQT.PLONG, MQT.PLONG]],
      'MQDISC' : ['void', [MQT.PHCONN, MQT.PLONG, MQT.PLONG]],
      'MQOPEN' : ['void', [MQT.HCONN, MQT.POD,MQT.LONG,MQT.PHOBJ,MQT.PLONG,MQT.PLONG]],
      'MQCLOSE': ['void', [MQT.HCONN, MQT.PHOBJ,MQT.LONG,MQT.PLONG,MQT.PLONG]],
      'MQSTAT' : ['void', [MQT.HCONN, MQT.LONG, MQT.PSTS, MQT.PLONG,MQT.PLONG]],
      'MQBEGIN': ['void', [MQT.HCONN, 'pointer', MQT.PLONG, MQT.PLONG]],
      'MQCMIT' : ['void', [MQT.HCONN, MQT.PLONG, MQT.PLONG]],
      'MQBACK' : ['void', [MQT.HCONN, MQT.PLONG, MQT.PLONG]],
      'MQPUT'  : ['void', [MQT.HCONN, MQT.HOBJ,MQT.PMD,MQT.PPMO,MQT.LONG, 'pointer',MQT.PLONG, MQT.PLONG]],
      'MQPUT1' : ['void', [MQT.HCONN, MQT.POD, MQT.PMD, MQT.PPMO, MQT.LONG, 'pointer',MQT.PLONG, MQT.PLONG]],
      'MQGET'  : ['void', [MQT.HCONN, MQT.HOBJ,MQT.PMD, MQT.PGMO,MQT.LONG, 'pointer',MQT.PLONG, MQT.PLONG, MQT.PLONG]],
      'MQSUB'  : ['void', [MQT.HCONN, MQT.PSD, MQT.PHOBJ,MQT.PHOBJ,MQT.PLONG,MQT.PLONG]],
      'MQSUBRQ': ['void', [MQT.HCONN, MQT.HOBJ, MQT.LONG,MQT.PSRO,MQT.PLONG,MQT.PLONG]],
      //'MQCTL'  : ['void', [MQT.HCONN, MQT.LONG, MQT.PCTLO,MQT.PLONG,MQT.PLONG]],
      //'MQCB'   : ['void', [MQT.HCONN, MQT.LONG, MQT.PCBD,MQT.HOBJ,MQT.PMD,MQT.PGMO,MQT.PLONG,MQT.PLONG]],
      'MQINQ'  : ['void', [MQT.HCONN, MQT.HOBJ, MQT.LONG, mqLongArray, MQT.LONG, mqLongArray, MQT.LONG, 'pointer', MQT.PLONG,MQT.PLONG]],
      'MQSET'  : ['void', [MQT.HCONN, MQT.HOBJ, MQT.LONG, mqLongArray, MQT.LONG, mqLongArray, MQT.LONG, 'pointer', MQT.PLONG,MQT.PLONG]],
      'MQCRTMH' : ['void', [MQT.HCONN, MQT.PCMHO, MQT.PHMSG, MQT.PLONG, MQT.PLONG]],
      'MQDLTMH' : ['void', [MQT.HCONN, MQT.PHMSG, MQT.PDMHO, MQT.PLONG, MQT.PLONG]],
      'MQSETMP' : ['void', [MQT.HCONN, MQT.HMSG, MQT.PSMPO, MQT.PCHARV, MQT.PPD, MQT.LONG, MQT.LONG, 'pointer', MQT.PLONG, MQT.PLONG]],
      'MQINQMP' : ['void', [MQT.HCONN, MQT.HMSG, MQT.PIMPO, MQT.PCHARV, MQT.PPD, MQT.PLONG, MQT.LONG, 'pointer', MQT.PLONG, MQT.PLONG, MQT.PLONG]],
      'MQDLTMP' : ['void', [MQT.HCONN, MQT.HMSG, MQT.PDMPO, MQT.PCHARV, MQT.PLONG, MQT.PLONG]],
    });
    return null;
  } catch(err) {
    return err;
  }
}

// Try to load the MQ library from the default (unqualified) location. But
// in case setmqenv has not been run, try some other well-known directories.
// Include a chance to load it from within this package's directory.
// Throw an exception if the library cannot be loaded.
function loadLibMulti() {
  var l;
  var err;
  var p;
  var ldPath;
  var newLdPath;

  if (process.platform === 'win32') {
    l='mqm';
    err = loadLib(null,l);
    if (err) {
       err = loadLib("c:\\Program Files\\IBM\\MQ\\bin64",l);
    }
    if (err) {
       err = loadLib("c:\\Program Files\\IBM\\MQ\\bin",l);
    }
    // A final section looks for the redistributable client as part of the Node package
    if (err) {
      p = path.join(__dirname,"../redist", "bin64");
      ldPath = process.env['PATH'];
      newLdPath = p;
      if (ldPath != null) {
        newLdPath = p + ";" + ldPath;
      }
      process.env['PATH'] = newLdPath;
      err = loadLib(p,l);
    }
  } else {
    l='libmqm_r';
    err = loadLib(null,l);

    if (err) {
      err = loadLib("/opt/mqm/lib64",l);
    }
    if (err) {
       err = loadLib("/opt/mqm/lib64/compat",l);
    }
    if (err) {
      err = loadLib("/opt/mqm/lib",l);
    }
    // A final section looks for the redistributable client as part of the Node package
    if (err) {
      p = path.join(__dirname,"../redist", "lib64");
      ldPath = process.env['LD_LIBRARY_PATH'];
      newLdPath = p;
      if (ldPath != null) {
        newLdPath = p + ":" + ldPath;
      }
      //process.env['LD_LIBRARY_PATH'] = newLdPath;
      err = loadLib(p,l);
    }
  }
  if (err) {
    console.error("Cannot find MQ C library.");
    console.error("  Has the C client been installed?");
    console.error("  Have you run setmqenv?");
    throw err;
  }
}

loadLibMulti();

/**
 * MQQueueManager contains the connection to the queue manager. Fields
 * in this object are not meant to be directly referenced by user applications..
 * @class
 */
function MQQueueManager(hConn,name) {
  this._hConn = hConn;
  this._name = name;
  Object.seal(this);
}

/**
 * MQObject contains a reference to an open object and the associated
 * queue manager. Fields in this object are not meant to be directly referenced
 * by user applications. Combining hConn and hObj in a single object means
 * we can simplify the API.
 * @class
 */
function MQObject(hObj,mqQueueManager,name) {
  this._hObj = hObj;
  this._mqQueueManager = mqQueueManager; // enables access to the hConn
  this._name  = name;
  Object.seal(this);
}

/**
 * MQAttr contains information about object attributes used in Set (MQSET)
 * and Inq (MQINQ) operations.
 * @class
 */
exports.MQAttr = function (selector,value) {
  /** The MQIA/MQCA selector value. For example MQIA_INHIBIT_PUT
  @member {number}
  */
  this.selector = selector;
  /**
  The "value" is optional in the constructor when making Inq() calls.
  @member {Object}
  */
  this.value = value;
  Object.seal(this);
};


/**
 * MQError holds the MQRC and MQCC values returned from an MQI verb.
 * For convenience, it also holds the name of the verb that failed.
 * It is a subclass of Error(). A pre-formatted error message is available
 * from this class, but individual fields are also accessible for applications that
 * want to handle errors fully themselves.
 * @class
 * @implements {Error}
 */
function MQError(mqcc,mqrc,verb)  {
  // Standard setting up for Error objects
  Error.call(this);
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;

  // Find the strings corresponding to MQRC/MCC numbers
  var mqrcstr = exports.Lookup('MQRC',mqrc);
  if (!mqrcstr)
    mqrcstr = exports.Lookup('MQRCCF', mqrc);
  if (!mqrcstr)
    mqrcstr = "Unknown";
  var mqccstr = exports.Lookup('MQCC',mqcc);
  if (!mqccstr)
    mqccstr = "Unknown";
  this.message = util.format("%s: MQCC = %s [%d] MQRC = %s [%d]", verb,mqccstr,mqcc,mqrcstr,mqrc);
  // Add custom fields for direct access
  /** @member {number} */
  this.mqcc  = mqcc;
  /** @member {String} */
  this.mqccstr  = mqccstr;
  /** @member {number} */
  this.mqrc = mqrc;
  /** @member {String} */
  this.mqrcstr  = mqrcstr;
  /** @member {String} */
  this.version = packageVersion;
  /** @member {String} */
  this.verb = verb; // A string such as "PUT" or "CMIT"
  Object.seal(this);
}
util.inherits(MQError, Error);

/*
 * Check that the callback parameter (if supplied) is valid.
 * Throw an exception if it is not.
 */
function checkParamCBRequired(cb,required) {
  if (required && cb == null) {
    throw new TypeError('Callback function must be provided');
  }
  if (cb && (typeof cb !== 'function')) {
    var err = new TypeError('Callback must be a function');
    throw err;
  }
}
function checkParamCB(cb) {
  checkParamCBRequired(cb,false);
}

/*
 * Generic type checkers for MQI parameters passed from user applications.
 * @param {Object} b - object to check
 * @param {Type} t - expected type
 * @param {String} m - type shown in error
 * @param {boolean} required - if true, object b must not be null.
 * @throws {TypeError}
 */
function checkParamRequired(b, t, m, required) {
  if (required && b == null) {
    throw new TypeError('Parameter of type ' + m + ' must be provided');
  }
  if (!required && b == null) {
    return;
  }

  // Handle basic types first
  if (t == 'number' || t == 'string') {
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
}

function checkParam(b,t,m,o) {
  if (o != null) {
    checkParamRequired(b,t,m,o);
  } else {
    checkParamRequired(b,t,m,true);
  }
}

function checkArray(o) {
  var rc = (!!o) && (o.constructor === Array);
  if (!rc) {
    throw new TypeError('Parameter must be an Array');
  }
  return rc;
}

// A set of functions to deal with storing state across
// MQGET callbacks.
var contextMap = new Map();
function UserContext(o,cb) {
  this.cb = cb;
  this.object = o;
  this.WaitInterval = 0;
  this.jsgmo = null;
  this.jsmd = null;
  this.buf = null;
  this.bufSize = defaultBufSize; // Use a 10K buffer by default
  Object.seal(this);
}

// The key to the contextMap is a combination of the hObj and hConn, which will
// be unique in this process.
function getKey(jsObject) {
  var rc;
  if (jsObject) {
    rc = jsObject._mqQueueManager._hConn + "/" + jsObject._hObj;
  } else {
    rc = null;
  }
  return rc;
}

function setUserContext(jsObject,cb,callbackArea) {
  var c = new UserContext(jsObject,cb,callbackArea);
  var key = getKey(jsObject);
  if (key) {
    contextMap.set(key,c);
  }
  return c;
}

function getUserContext(jsObject) {
  if (jsObject) {
    var key = getKey(jsObject);
    if (key) {
      return contextMap.get(key);
    }
  }
  return null;
}

function deleteUserContext(jsObject) {
  var key = getKey(jsObject);
  if (key) {
    contextMap.delete(key);
  }
}

/*
 * Get rid of all the saved information on a connection.
 */
function deleteUserConnection(hConn) {
  if (hConn && hConn != -1) {
    var partialKey = hConn + "/";
    for (var key of contextMap.keys()) {
      if (key.startsWith(partialKey)) {
        contextMap.delete(key);
      }
    }
  }
}

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
exports.Lookup= function(range,val){
  var f = range +"_STR";
   try {
     var x = mqistrings[f](val);
     return x;
   } catch (e) {
     return null;
   }
};

/*
 * And now start to export the real MQI functions as
 * JavaScript methods. The callbacks are all invoked with an MQError(mqrc,mqcc)
 * object when there is an error or warning.
 */

/**
 * Connx - callback is passed object containing the hConn on success.
 *
 * @param {String}
 *        qMgrName - the queue manager to connect to
 * @param {MQCNO}
 *        cno - connection options
 * @param {function}
 *        callback - optional. Invoked for errors and
 *        with a reference to the qmgr connection.
 * @return {MQQueueManager} A reference to the connection
 * @throws {MQError}
 *         Container for MQRC and MQCC values
 * @throws {TypeError}
 *         When a parameter is of incorrect type
 */
exports.Connx = function (jsqMgrName, jsCno, cb) {
  checkParamCB(cb);
  checkParamRequired(jsCno, MQCNO.MQCNO, 'MQCNO',false);

  var mqRc = ref.alloc(MQT.LONG);
  var mqCc = ref.alloc(MQT.LONG);
  var mqHConn = ref.alloc(MQT.HCONN);
  var copyback = true;

  // Make sure we always set flags to permit MQ objects to work
  // across threads.
  if (jsCno == null) {
    copyback = false;
    jsCno = new MQCNO.MQCNO();
  }
  if ((jsCno.Options & (MQC.MQCNO_HANDLE_SHARE_NO_BLOCK |
                       MQC.MQCNO_HANDLE_SHARE_BLOCK)) == 0) {
    jsCno.Options |= MQC.MQCNO_HANDLE_SHARE_NO_BLOCK;
  }

  var mqCno = MQCNO._copyCNOtoC(jsCno);

  // Deal with empty or null qmgrName for default connection
  var mqqMgrName = ref.NULL_POINTER;
  if (jsqMgrName != null && jsqMgrName.length > 0) {
    mqqMgrName = ref.allocCString(jsqMgrName);
  }

  libmqm.MQCONNX(mqqMgrName,mqCno.ref(), mqHConn,mqCc,mqRc);

  var jsHConn = mqHConn.deref();
  var jsRc = mqRc.deref();
  var jsCc = mqCc.deref();

  if (copyback) {
    MQCNO._copyCNOfromC(mqCno,jsCno);
  }

  // If it did not work, create an MQError object with the reason codes,
  // otherwise invoke the callback with the hConn-containing object.
  var hConn = new MQQueueManager(jsHConn,jsqMgrName);
  var err = new MQError(jsCc,jsRc,'CONNX');

  if (cb) {
    if (jsCc != MQC.MQCC_OK) {
      cb(err,null);
    } else {
      cb(null,hConn);
    }
  } else {
    if (jsCc != MQC.MQCC_OK) {
      throw err;
    } else {
      return hConn;
    }
  }
};

/**
 * Conn - simpler version of Connx.
 * The callback is passed object containing the hConn on success
 *
 * @param {String}
 *        qMgrName - the queue manager to connect to
 * @param {function}
 *        callback - optional. Invoked for errors and
 *        with a reference to the qmgr connection.
 * @return {MQQueueManager) A reference to the connection
 * @throws {MQError}
 *         Container for MQRC and MQCC values
 * @throws {TypeError}
 *         When a parameter is of incorrect type
 */
exports.Conn = function (jsqMgrName, cb) {
  exports.Connx(jsqMgrName,null,cb);
};


/**
 * Disc - Disconnect from the queue manager.
 *
 * @param {MQQueueManager}
 *        queueManager - reference to the queue manager
 * @param {function}
 *        callback - optional. Invoked for errors.
 * @throws {MQError}
 *         Container for MQRC and MQCC values
 * @throws {TypeError}
 *         When a parameter is of incorrect type
 */
exports.Disc = function(jsQueueManager, cb) {
  checkParamCB(cb);
  checkParamRequired(jsQueueManager, MQQueueManager, 'MQQueueManager',false);

  var jsRc = MQC.MQRC_NONE;
  var jsCc = MQC.MQCC_OK;
  var savedHConn = null;

  if (jsQueueManager) {
    savedHConn = jsQueueManager._hConn;
    var mqHConn  = ref.alloc(MQT.HCONN, jsQueueManager._hConn);
    var mqRc = ref.alloc(MQT.LONG);
    var mqCc = ref.alloc(MQT.LONG);

    libmqm.MQDISC(mqHConn,mqCc,mqRc);

    jsQueueManager._hConn = mqHConn.deref();

    jsRc = mqRc.deref();
    jsCc = mqCc.deref();
  } else {
    jsRc = MQC.MQRC_HCONN_ERROR;
    jsCc = MQC.MQCC_FAILED;
  }

  if (jsCc == MQC.MQCC_OK) {
    deleteUserConnection(savedHConn);
  }

  var err = new MQError(jsCc,jsRc,"DISC");

  if (cb) {
    if (jsCc != MQC.MQCC_OK) {
      cb(err);
    } else {
      cb(null);
    }
  } else {
    if (jsCc != MQC.MQCC_OK) {
      throw err;
    } else {
      return;
    }
  }
};

/**
 * Open - Open an object such as a queue or topic.
 *
 * @param {MQQueueManager}
 *        queueManager - reference to the queue manager (hConn)
 * @param {MQOD}
 *        jsod - MQ Object Descriptor including the name and
 *        type of object to open
 * @param {number}
 *        openOptions - how the object is intended to be used.
 * @param {function}
 *        callback - optional. Invoked for errors and given a
 *        reference to the opened object on success.
 * @return {MQObject} A reference to the opened object (hObj)
 * @throws {MQError}
 *          Container for MQRC and MQCC values
 * @throws {TypeError}
 *          When a parameter is of incorrect type
 */
exports.Open = function(jsQueueManager,jsod,jsOpenOptions,cb) {
  checkParamCB(cb);
  checkParam(jsQueueManager, MQQueueManager, 'MQQueueManager');
  checkParam(jsod, MQOD.MQOD, 'MQOD');
  checkParam(jsOpenOptions,'number','number');

  var mqHObj  = ref.alloc(MQT.HOBJ);
  var mqRc = ref.alloc(MQT.LONG);
  var mqCc = ref.alloc(MQT.LONG);
  var mqOd = MQOD._copyODtoC(jsod);

  libmqm.MQOPEN(jsQueueManager._hConn,mqOd.ref(),jsOpenOptions,mqHObj,mqCc,mqRc);

  MQOD._copyODfromC(mqOd,jsod);

  var jsHObj = mqHObj.deref();
  var jsRc = mqRc.deref();
  var jsCc = mqCc.deref();

  var jsObject = new MQObject(jsHObj,jsQueueManager,jsod.ObjectName);
  var err = new MQError(jsCc,jsRc,"OPEN");

  if (cb) {
    if (jsCc != MQC.MQCC_OK) {
      cb(err,null);
    } else {
      cb(null,jsObject);
    }
  } else {
    if (jsCc != MQC.MQCC_OK) {
      throw err;
    } else {
      return jsObject;
    }
  }
};

/**
 * Close - Close an opened object.
 *
 * @param {MQObject}
 *        jsObject - reference to the object (contains hConn and hObj)
 * @param {number}
 *        closeOptions
 * @param {function}
 *        callback - optional. Invoked for errors. No additional parameters
 *        on success.
 * @throws {MQError}
 *         Container for MQRC and MQCC values
 * @throws {TypeError}
 *         When a parameter is of incorrect type
 */
exports.Close = function(jsObject, jsCloseOptions, cb) {
  checkParamCB(cb);
  checkParamRequired(jsObject, MQObject, 'MQObject',false);
  checkParam(jsCloseOptions,'number','number');

  var jsRc = MQC.MQCC_OK;
  var jsCc = MQC.MQRC_NONE;

  if (jsObject) {
    var mqHObj  = ref.alloc(MQT.HOBJ, jsObject._hObj);
    var mqRc = ref.alloc(MQT.LONG);
    var mqCc = ref.alloc(MQT.LONG);

    libmqm.MQCLOSE(jsObject._mqQueueManager._hConn,mqHObj,jsCloseOptions, mqCc,mqRc);

    jsRc = mqRc.deref();
    jsCc = mqCc.deref();
    if (jsCc == MQC.MQCC_OK) {
      deleteUserContext(jsObject);
    }
    jsObject._hObj = mqHObj.deref();
  } else {
    jsRc = MQC.MQRC_HOBJ_ERROR;
    jsCc = MQC.MQCC_FAILED;
  }

  var err = new MQError(jsCc,jsRc,"CLOSE");

  if (cb) {
    if (jsCc != MQC.MQCC_OK) {
      cb(err);
    } else {
      cb(null);
    }
  } else {
    if (jsCc != MQC.MQCC_OK) {
      throw err;
    } else {
      return;
    }
  }
};


/**
 * Stat  - Get status of operations
 *
 * @param {MQQueueManager}
 *        queueManager - reference to the queue manager (hConn)
 * @param {number}
 *        type - type of status being requested (MQSTAT_TYPE_*)
 * @param {function}
 *        callback - optional. Invoked for errors and with the status
 *        response structure.
 * @returns {MQSTS}
 * @throws {MQError}
 *         Container for MQRC and MQCC values
 * @throws {TypeError}
 *         When a parameter is of incorrect type
 */
exports.Stat  = function(jsQueueManager, jsType, cb) {
  checkParamCB(cb);
  checkParam(jsQueueManager, MQQueueManager, 'MQQueueManager');
  checkParam(jsType,'number','number');

  var jsRc = MQC.MQCC_OK;
  var jsCc = MQC.MQRC_NONE;

  var mqRc = ref.alloc(MQT.LONG);
  var mqCc = ref.alloc(MQT.LONG);
  var jssts = new MQSTS.MQSTS();

  var mqsts = MQSTS._copySTStoC(jssts);

  libmqm.MQSTAT(jsQueueManager._hConn,jsType,mqsts.ref(), mqCc,mqRc);

  jsRc = mqRc.deref();
  jsCc = mqCc.deref();
  if (jsCc == MQC.MQCC_OK) {
    MQSTS._copySTSfromC(mqsts,jssts);
  }

  var err = new MQError(jsCc,jsRc,"STAT");

  if (cb) {
    if (jsCc != MQC.MQCC_OK) {
      cb(err, jssts);
    } else {
      cb(null, jssts);
    }
  } else {
    if (jsCc != MQC.MQCC_OK) {
      throw err;
    } else {
      return jssts;
    }
  }
};

/**
 * Begin - Start a global transaction.
 *
 * @param {MQQueueManager}
 *        queueManager - reference to the queue manager (hConn)
 * @param {function}
 *        callback - optional. Invoked for errors. No additional parameter
 *        on success.
 * @throws {MQError}
 *         Container for MQRC and MQCC values
 * @throws {TypeError}
 *         When a parameter is of incorrect type
 */
exports.Begin = function(jsQueueManager, cb) {
  checkParamCB(cb);
  checkParam(jsQueueManager, MQQueueManager, 'MQQueueManager');

  var mqRc = ref.alloc(MQT.LONG);
  var mqCc = ref.alloc(MQT.LONG);

  // The MQBO structure can be set to NULL as there are no
  // real options defined at the moment.
  libmqm.MQBEGIN(jsQueueManager._hConn,ref.NULL_POINTER,mqCc,mqRc);

  var jsRc = mqRc.deref();
  var jsCc = mqCc.deref();
  var err = new MQError(jsCc,jsRc,"BEGIN");

  if (cb) {
    if (jsCc != MQC.MQCC_OK) {
      cb(err);
    } else {
      cb(null);
    }
  } else {
    if (jsCc != MQC.MQCC_OK) {
      throw err;
    } else {
      return;
    }
  }
};

/**
 * Cmit - Commit an in-flight transaction.
 *
 * @param {MQQueueManager}
 *        queueManager - reference to the queue manager (hConn)
 * @param {function}
 *        callback - optional. Invoked for errors. No additional parameter
 *        on success.
 * @throws {MQError}
 *         Container for MQRC and MQCC values
 * @throws {TypeError}
 *         When a parameter is of incorrect type
 */
exports.Cmit = function(jsQueueManager, cb) {
  checkParamCB(cb);
  checkParam(jsQueueManager, MQQueueManager, 'MQQueueManager');

  var mqRc = ref.alloc(MQT.LONG);
  var mqCc = ref.alloc(MQT.LONG);

  libmqm.MQCMIT(jsQueueManager._hConn,mqCc,mqRc);

  var jsRc = mqRc.deref();
  var jsCc = mqCc.deref();
  var err = new MQError(jsCc,jsRc,"CMIT");

  if (cb) {
    if (jsCc != MQC.MQCC_OK) {
      cb(err);
    } else {
      cb(null);
    }
  } else {
    if (jsCc != MQC.MQCC_OK) {
      throw err;
    } else {
      return;
    }
  }
};

/**
 * Back - Backout an in-flight transaction.
 *
 * @param {MQQueueManager}
 *        queueManager - reference to the queue manager (hConn)
 * @param {function}
 *        callback - optional. Invoked for errors. No additional parameter
 *        on success.
 * @throws {MQError}
 *         Container for MQRC and MQCC values
 * @throws {TypeError}
 *         When a parameter is of incorrect type
 */
exports.Back = function(jsQueueManager, cb) {
  checkParamCB(cb);
  checkParam(jsQueueManager, MQQueueManager, 'MQQueueManager');

  var mqRc = ref.alloc(MQT.LONG);
  var mqCc = ref.alloc(MQT.LONG);

  libmqm.MQBACK(jsQueueManager._hConn,mqCc,mqRc);

  var jsRc = mqRc.deref();
  var jsCc = mqCc.deref();
  var err = new MQError(jsCc,jsRc,"BACK");

  if (cb) {
    if (jsCc != MQC.MQCC_OK) {
      cb(err);
    } else {
      cb(null);
    }
  } else {
    if (jsCc != MQC.MQCC_OK) {
      throw err;
    } else {
      return;
    }
  }
};

/**
 * Sub - Subscribe to a topic.
 * <p>If using managed destinations where the queue manager creates a
 * queue on your behalf, the reference to it is given to the callback
 * function.
 *
 * @param {MQQueueManager}
 *        queueManager - reference to the queue manager (hConn)
 * @param {MQObject}
 *        queueObject - the queue to which publications will be
 *        delivered. Can be null to indicate a managed queue should
 *        be allocated.
 * @param {MQSD}
 *        jssd - MQ Subscription Descriptor including the topic to be
 *        subscribed.
 * @param {function}
 *        callback - optional. Invoked for errors. On success, given a
 *        reference to the opened subscription and the opened queue.
 * @return {MQObject} A reference to the subscription (hSub)
 * @throws {MQError}
 *         Container for MQRC and MQCC values
 * @throws {TypeError}
 *         When a parameter is of incorrect type
 */
exports.Sub = function(jsQueueManager,jsQueueObject,jssd,cb) { //-> fill in Hobj if managed, Hsub describing subscription
  checkParamCB(cb);
  checkParam(jsQueueManager, MQQueueManager, 'MQQueueManager');
  checkParamRequired(jsQueueObject, MQObject,'MQObject',false);
  checkParam(jssd, MQSD.MQSD, 'MQSD');

  var jsHObjQ = MQC.MQHO_UNUSABLE_HOBJ;
  if (jsQueueObject) {
    jsHObjQ = jsQueueObject._jshObj;
  }

  var mqRc = ref.alloc(MQT.LONG);
  var mqCc = ref.alloc(MQT.LONG);
  var mqHObjQ  = ref.alloc(MQT.HOBJ, jsHObjQ);
  var mqHObjSub = ref.alloc(MQT.HOBJ);

  var mqSd = MQSD._copySDtoC(jssd);

  libmqm.MQSUB(jsQueueManager._hConn,
               mqSd.ref(),
               mqHObjQ,
               mqHObjSub,
               mqCc,
               mqRc);

  MQSD._copySDfromC(mqSd, jssd);

  var jsRc = mqRc.deref();
  var jsCc = mqCc.deref();
  jsHObjQ   = mqHObjQ.deref();
  var jsHObjSub = mqHObjSub.deref();

  var err = new MQError(jsCc,jsRc,"SUB");

  var jsSubObject = new MQObject(jsHObjSub,jsQueueManager,jssd.ResObjectString);
  var jsPublicationQueueObject = jsQueueObject;
  if (!jsPublicationQueueObject){
    jsPublicationQueueObject = new MQObject(jsHObjQ, jsQueueManager,'ManagedQueue');
  }

  if (cb) {
    if (jsCc != MQC.MQCC_OK) {
      cb(err, jsPublicationQueueObject, jsSubObject);
    } else {
      cb(null, jsPublicationQueueObject, jsSubObject);
    }
  } else {
    if (jsCc != MQC.MQCC_OK) {
      throw err;
    } else {
      return jsSubObject;
    }
  }
};

/**
 * Subrq - Request retained publications
 * <p>If using managed destinations where the queue manager creates a
 * queue on your behalf, the reference to it is given to the callback
 * function.
 *
 * @param {MQQueueManager}
 *        queueManager - reference to the queue manager (hConn)
 * @param {MQObject}
 *        subObject - handle representing a subscription made earlier by
 *        a call to the Sub() method.
 * @param {number}
 *        action - what to do
 * @param {MQSRO}
 *        jssro - MQ Subscription Request Options
 * @param {function}
 *        callback - optional. Invoked for errors.
 * @throws {MQError}
 *         Container for MQRC and MQCC values
 * @throws {TypeError}
 *         When a parameter is of incorrect type
 */
exports.Subrq = function(jsQueueManager,jsSubObject,jsaction,jssro,cb) {
  checkParamCB(cb);
  checkParam(jsQueueManager, MQQueueManager, 'MQQueueManager');
  checkParamRequired(jsSubObject, MQObject,'MQObject',false);
  checkParam(jssro, MQSRO.MQSRO, 'MQSRO');
  checkParam(jsaction, 'number', 'number');

  var mqRc = ref.alloc(MQT.LONG);
  var mqCc = ref.alloc(MQT.LONG);
  var mqSro = MQSRO._copySROtoC(jssro);

  libmqm.MQSUBRQ(jsQueueManager._hConn,
               jsSubObject._hObj,
               jsaction,
               mqSro.ref(),
               mqCc,
               mqRc);

  MQSD._copySROfromC(mqSro, jssro);

  var jsRc = mqRc.deref();
  var jsCc = mqCc.deref();

  var err = new MQError(jsCc,jsRc,"SUBRQ");

  if (cb) {
    if (jsCc != MQC.MQCC_OK) {
      cb(err);
    } else {
      cb(null);
    }
  } else {
    if (jsCc != MQC.MQCC_OK) {
      throw err;
    } else {
      return;
    }
  }
};

/**
 * Put -  Put a message to a queue or publish to a topic.
 *
 * @param {MQObject}
 *        jsObject - reference to the opened object (hConn and hObj)
 * @param {MQMD}
 *        jsmd - the message Descriptor
 * @param {MQPMO}
 *        jspmo - Put Message Options
 * @param {Object}
 *        buf - containing the message contents. Can be a String or Buffer
 * @param {function}
 *        callback - optional. Invoked for errors. No additional parameter
 *        on success.
 * @throws {MQError}
 *         Container for MQRC and MQCC values
 * @throws {TypeError}
 *         When a parameter is of incorrect type
 */
exports.Put = function(jsObject,jsmd,jspmo,buf,cb) {
  checkParamCB(cb);
  checkParam(jsObject, MQObject, 'MQObject');
  checkParam(jsmd, MQMD.MQMD, 'MQMD');
  checkParam(jspmo, MQPMO.MQPMO, 'MQPMO');

  var mqRc = ref.alloc(MQT.LONG);
  var mqCc = ref.alloc(MQT.LONG);

  var mqMd = MQMD._copyMDtoC(jsmd);
  var mqPmo = MQPMO._copyPMOtoC(jspmo);

  // If it's a string, then we need to create a Buffer from it.
  // We also set the MQMD Format
  // TODO: Are there any string codepage conversions we should look at here?
  //       Do we need to set the CCSID in some way?
  if (buf) {
    if (typeof buf == "string") {
      buf = Buffer.from(buf);
      u.setMQIString(mqMd.Format,"MQSTR");
    } else {
      checkParam(buf,Buffer,'Buffer');
    }
  }

  var bufflen = 0;
  if (buf) {
    bufflen = buf.length;
  }

  var ptr = ref.NULL_POINTER;
  if (bufflen > 0) {
    ptr = buf;
  }

  libmqm.MQPUT(jsObject._mqQueueManager._hConn,
               jsObject._hObj,
               mqMd.ref(),
               mqPmo.ref(),
               bufflen,
               ptr,
               mqCc,
               mqRc);

  MQMD._copyMDfromC(mqMd, jsmd);
  MQPMO._copyPMOfromC(mqPmo, jspmo);

  var jsRc = mqRc.deref();
  var jsCc = mqCc.deref();
  var err = new MQError(jsCc,jsRc,"PUT");

  if (cb) {
    if (jsCc != MQC.MQCC_OK) {
      cb(err);
    } else {
      cb(null);
    }
  } else {
    if (jsCc != MQC.MQCC_OK) {
      throw err;
    } else {
      return;
    }
  }
};

/**
 * Put1 -  Put a message to a queue or publish to a topic.
 *
 * <p>Put1 puts a single messsage to a queue or topic. Typically used
 * for one-shot replies where it can be cheaper than multiple
 * Open/Put/Close sequences
 *
 * @param {MQQueueManager}
 *        queueManager - reference to the queue manager (hConn)
 * @param {MQOD}
 *        jsod - MQ Object Descriptor including the name and
 *        type of object to open
 * @param {MQMD}
 *        jsmd - the message Descriptor
 * @param {MQPMO}
 *        jspmo - Put Message Options
 * @param {Object}
 *        buf - containing the message contents. Can be a String or Buffer
 * @param {function}
 *        callback - optional. Invoked for errors. No additional parameter
 *        on success.
 * @throws {MQError}
 *         Container for MQRC and MQCC values
 * @throws {TypeError}
 *         When a parameter is of incorrect type
 */
exports.Put1 = function(jsQueueManager,jsod, jsmd,jspmo,buf,cb) {
  checkParamCB(cb);
  checkParam(jsQueueManager, MQQueueManager, 'MQQueueManager');
  checkParam(jsmd, MQMD.MQMD, 'MQMD');
  checkParam(jsod, MQOD.MQOD, 'MQOD');
  checkParam(jspmo, MQPMO.MQPMO, 'MQPMO');

  var mqRc = ref.alloc(MQT.LONG);
  var mqCc = ref.alloc(MQT.LONG);

  var mqMd = MQMD._copyMDtoC(jsmd);
  var mqOd = MQOD._copyODtoC(jsod);
  var mqPmo = MQPMO._copyPMOtoC(jspmo);

  // If it's a string, then we need to create a Buffer from it.
  // We also set the MQMD Format
  // TODO: Are there any string codepage conversions we should look at here?
  if (buf) {
    if (typeof buf == "string") {
      buf = Buffer.from(buf);
      u.setMQIString(mqMd.Format,"MQSTR");
    } else {
      checkParam(buf,Buffer,'Buffer');
    }
  }

  var bufflen = 0;
  if (buf) {
    bufflen = buf.length;
  }

  var ptr = ref.NULL_POINTER;
  if (bufflen > 0) {
    ptr = buf;
  }

  libmqm.MQPUT1(jsQueueManager._hConn,
               mqOd.ref(),
               mqMd.ref(),
               mqPmo.ref(),
               bufflen,
               ptr,
               mqCc,
               mqRc);

  MQOD._copyODfromC(mqOd, jsod);
  MQMD._copyMDfromC(mqMd, jsmd);
  MQPMO._copyPMOfromC(mqPmo, jspmo);

  var jsRc = mqRc.deref();
  var jsCc = mqCc.deref();
  var err = new MQError(jsCc,jsRc,"PUT1");

  if (cb) {
    if (jsCc != MQC.MQCC_OK) {
      cb(err);
    } else {
      cb(null);
    }
  } else {
    if (jsCc != MQC.MQCC_OK) {
      throw err;
    } else {
      return;
    }
  }
};

/**
 * GetSync -  Get a message from a queue synchronously.
 *
 * <p>Note that this function will block until the MQGET returns.
 *
 * @param {MQObject}
 *        jsObject - reference to the opened object (hConn and hObj)
 * @param {MQMD}
 *        jsmd - the message Descriptor
 * @param {MQGMO}
 *        jsgmo - Get Message Options
 * @param {Buffer}
 *        buf - to contain the message contents
 * @param {function}
 *        callback - optional. Invoked for errors. Length of returned data
 *        passed on success.
 * @return {number} Length of returned message.
 * @throws {MQError}
 *         Container for MQRC and MQCC values
 * @throws {TypeError}
 *         When a parameter is of incorrect type
 */
exports.GetSync = function(jsObject,jsmd,jsgmo,buf,cb) {
  checkParamCB(cb);
  checkParam(jsObject,MQObject, 'MQObject');
  checkParam(jsmd, MQMD.MQMD, 'MQMD');
  checkParam(jsgmo, MQGMO.MQGMO, 'MQGMO');
  checkParam(buf,Buffer,'Buffer');

  var mqRc = ref.alloc(MQT.LONG);
  var mqCc = ref.alloc(MQT.LONG);
  var datalen = ref.alloc(MQT.LONG);

  var mqMd = MQMD._copyMDtoC(jsmd);
  var mqGmo = MQGMO._copyGMOtoC(jsgmo);

  var bufflen = 0;
  var ptr = ref.NULL_POINTER;
  if (buf) {
    bufflen = buf.length;
  }

  if (bufflen > 0) {
    ptr = buf;
  }

  libmqm.MQGET(jsObject._mqQueueManager._hConn,
               jsObject._hObj,
               mqMd.ref(),
               mqGmo.ref(),
               bufflen,
               ptr,
               datalen,
               mqCc,
               mqRc);

  MQMD._copyMDfromC(mqMd, jsmd);
  MQGMO._copyGMOfromC(mqGmo, jsgmo);

  var jsRc = mqRc.deref();
  var jsCc = mqCc.deref();
  var jsDatalen = datalen.deref();
  var err = new MQError(jsCc,jsRc,"GET");

  if (cb) {
    if (jsCc != MQC.MQCC_OK) {
      cb(err,jsDatalen);
    } else {
      cb(null, jsDatalen);
    }
  } else {
    if (jsCc != MQC.MQCC_OK) {
      throw err;
    } else {
      return jsDatalen;
    }
  }
};


/*********************************************************************
 * Functions to deal with async get
 */

/* Holds the timed loop for retrieval
 */
var getLoop = null;

/* Define the interval at which the MQGET loop for emulating async
 * retrieval is executed.This takes effect after a full cycle where no messages have
 * been retrieved.
 */
const getLoopPollTimeMsMin = 250;
const getLoopPollTimeMsDefault = 10 * 1000; // Default to 10 seconds

/* After completing a cycle of message retrieval where some messages have
 * been read, how soon should we
 * try again. Increasing this delay may be necessary if other work is
 * starved of CPU in a very busy messaging environment.
 */
const getLoopDelayTimeMsDefault = getLoopPollTimeMsMin;

/* How many messages to retrieve from an individual queue before moving to
 * try to get from a different queue in the set
 */
const maxConsecutiveGetsDefault = 100;

/* The values set into a single object to simplify application tuning
 * Most people should never need to touch these, and there is not a huge
 * amount of explanation on how they work - read the source in Get() to
 * get a deeper understanding.
 */
var tuningParameters = {
  maxConsecutiveGets : maxConsecutiveGetsDefault,
  getLoopPollTimeMs  : getLoopPollTimeMsDefault,
  getLoopDelayTimeMs : getLoopDelayTimeMsDefault
};

/**
 * setTuningParameters - Override values used to tune behaviour
 * <p>These properties affect the "fairness" heuristics that manage the
 * scheduling of message retrieval in a high-workload system.
 * @param {Object}
 *        parms - Object containing fields for the parameter values to override
 * @property {number} getLoopPollTimeMs - Milliseconds between each full poll cycle.
 * Default is 10000 (10 seconds)
 * @property {number} getLoopDelayTimeMs - Milliseconds to delay after a partial poll cycle.
 * Default is 250 (1/4 second)
 * @property {number} maxConsecutiveGets - How many messages to get from a queue before trying a different queue.
 * Default is 100
 * @throws {TypeError}
 *         When the parameter or its properties is of incorrect type
 * @example
 * console.log("Tuning parms are %j",mq.getTuningParameters());
 * mq.setTuningParameters({maxConsecutiveGets:20});
 * console.log("Tuning parms are now %j",mq.getTuningParameters());
 */
exports.setTuningParameters = function(v) {
  checkParam(v,Object,'Object',false);
  for (var key in v) {
    if (tuningParameters.hasOwnProperty(key)) {
      checkParam(v[key],'number','number',true);
      tuningParameters[key] = v[key];
    } else {
      var err = new TypeError('Unknown property : ' + key);
      throw err;
    }
  }
};

/**
 * getTuningParameters
 * @return Object containing the current values
 */
exports.getTuningParameters = function() {
  return tuningParameters;
};

/**
 * setPollTime - allow overriding of the MQGET receive poll timer
 * @deprecated Use setTuningParameters instead
 * @param {number}
 *     pollTimeMs - number of milliseconds between each poll. Default
 *      to 10000 (10 seconds)
 */
exports.setPollTime = function(v) {
  checkParam(v,'number','number',false);
  if (!v) {
    v = getLoopPollTimeMsDefault;
  }
  tuningParameters.getLoopPollTimeMs = v;
};

/**
 * setMaxConsecutiveGets - allow overriding of the MQGET fairness retrieval
 * @deprecated Use setTuningParameters instead
 * @param {number}
 *     maxConsecutiveGets - how many messages to retrieve from a queue before
 *      trying a different queue
 */
exports.setMaxConsecutiveGets = function(v) {
  checkParam(v,'number','number',false);
  if (!v) {
    v = maxConsecutiveGetsDefault;
  }
  tuningParameters.maxConsecutiveGets = v;
};

/**
 * Get -  Get a message from a queue asynchronously. Use GetDone()
 * to clear the callback. No data buffer needs to be supplied as input
 * to this function, but message data should be processed or copied
 * before returning from your callback as the buffer may get overwritten
 * by any subsequent message.
 * <p>The callback function is repetitively invoked for each message. You
 * do not need to reset after each retrieval.
 *
 * @param {MQObject}
 *        jsObject - reference to the opened object (hConn and hObj)
 * @param {MQMD}
 *        jsmd - the message Descriptor
 * @param {MQGMO}
 *        jsgmo - Get Message Options
 * @param {function}
 *        callback - Called when messages arrive. Parameters are
 *          (error, jsObject, MQGMO, MQMD, data)
 * @throws {MQError}
 *         Container for MQRC and MQCC values
 * @throws {TypeError}
 *         When a parameter is of incorrect type
 */
exports.Get = function(jsObject,jsmd,jsgmo,cb) {
  // The callback is not optional here - must be provided.
  checkParamCBRequired(cb,true);

  checkParam(jsObject,MQObject, 'MQObject');
  checkParam(jsmd, MQMD.MQMD, 'MQMD');
  checkParam(jsgmo, MQGMO.MQGMO, 'MQGMO');

  // Save information needed for the real MQGET operation
  var c = setUserContext(jsObject,cb);
  c.jsgmo = jsgmo;
  c.jsmd = jsmd;

  // Intial wait interval from the GMO
  c.WaitInterval = jsgmo.WaitInterval;

  // And start the retrieval loop if necessary
  if (getLoop == null) {
    if (tuningParameters.getLoopPollTimeMs < getLoopPollTimeMsMin) {
      tuningParameters.getLoopPollTimeMs = getLoopPollTimeMsMin;
    }
    lastIntervalMs = 0;
    getLoop = setTimeout(getLoopFunction,0);
  }
};


function shuffle (array) {
  var i = 0;
  var j = 0;
  var temp = null;

  for (i = array.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1));
    temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

/*
 * This function simulates asynch retrieval by issuing MQGET synch calls
 * on each Interval timer. All active queues are polled. The effective
 * WaitInterval is recalculated on each iteration until that timer expires,
 * when the calling application is given 2033 exception. The app can then
 * choose to cancel the outstanding get for that hObj. If a message is
 * retrieved on any loop, then the loop is immediately reexecuted.
 *
 * There are a couple of heuristics in here that might improve "fairness" in
 * situations where one queue has a lot of messages and is always being
 * serviced in preference to another queue:
 * 1) Each iteration of the main loop processes the list of queues in a
 *    random order
 * 2) No more than 100 messages are retrieved from a queue before we step
 *    on to the next queue in the set.
 */
var lastIntervalMs = 0;
function getLoopFunction() {
  var messageRetrieved = false;
  var hitMaxGets = false;
  if (contextMap.size > 0) {
    // Do this for all active hObj requests. If a message is retrieved
    // from the hObj, go round again immediately. If not, step on to the
    // next hObj.
    var values = Array.from(contextMap.values());
    shuffle(values); // A random reordering of the hObj may improve fairness
    for (var c of values) {
      var consecutiveGets = 0;
      do {
        messageRetrieved = false;
        if (c) {
          // Create copies of the original request parameters as they
          // may be modified during the GET processing. Object.assign()
          // does not copy the buffers, so have to do that manually.
          var jsgmo = Object.assign(new MQGMO.MQGMO(),c.jsgmo);
          jsgmo.MsgToken   = Buffer.from(c.jsgmo.MsgToken);

          var jsmd = Object.assign(new MQMD.MQMD(),c.jsmd);
          jsmd.Format   = Buffer.from(c.jsmd.Format);
          jsmd.CorrelId = Buffer.from(c.jsmd.CorrelId);
          jsmd.MsgId    = Buffer.from(c.jsmd.MsgId);
          jsmd.GroupId  = Buffer.from(c.jsmd.GroupId);
          jsmd.AccountingToken = Buffer.from(c.jsmd.AccountingToken);

          // Try to retrieve the message immediately
          messageRetrieved = GetSyncInternal(c,jsmd,jsgmo);
          if (c.jsgmo.WaitInterval >=0) {
            c.WaitInterval = c.WaitInterval - lastIntervalMs;
            // Reset wait interval to original value so next loop starts again.
            if (messageRetrieved) {
              c.WaitInterval = c.jsgmo.WaitInterval;
            } else if (c.WaitInterval <=0 && !messageRetrieved) {
              // and also throw the error to the caller.
              var err = new MQError(MQC.MQCC_FAILED, MQC.MQRC_NO_MSG_AVAILABLE,"Get");
              c.cb(err, c.object);
              c.WaitInterval = c.jsgmo.WaitInterval;
            }
          }
        }
        // If we just got a message, then try again immediately.
        if (messageRetrieved) {
          lastIntervalMs = 0;
          consecutiveGets++;
        }

        if (consecutiveGets >= tuningParameters.maxConsecutiveGets) {
          hitMaxGets = true;
        }
      } while (messageRetrieved && consecutiveGets < tuningParameters.maxConsecutiveGets);
    }
    if (hitMaxGets) {
      // If any of the hObjs in the set has had a max retrieval count, then
      // go through the full set again almost immediately
      lastIntervalMs = 0;
      getLoop = setTimeout(getLoopFunction,tuningParameters.getLoopDelayTimeMs);
    } else {
      lastIntervalMs = tuningParameters.getLoopPollTimeMs;
      getLoop = setTimeout(getLoopFunction,tuningParameters.getLoopPollTimeMs);
    }
  } else {
    getLoop = null;
  }
}

/**
 * GetDone -  Stop the Get processing by removing the listener
 * for more messages.
 *
 * @param {MQObject}
 *        jsObject - reference to the opened object (hConn and hObj)
 * @param {function}
 *        callback - Invoked for errors.
 * @throws {MQError}
 *         Container for MQRC and MQCC values
 * @throws {TypeError}
 *         When a parameter is of incorrect type
 */
exports.GetDone = function(jsObject, cb) {

  var userContext = getUserContext(jsObject);
  var err;
  if (!userContext) {
    err = new MQError(MQC.MQCC_FAILED,MQC.MQRC_HOBJ_ERROR,"GetDone");
    throw err;
  }

  deleteUserContext(jsObject);

  if (cb) {
    cb(null);
  }
};

/*
 * This function is used to simulate asynchronous message retrieval.
 * It does an MQGET with immediate timeout. If the buffer is too small
 * for the retrieved message, it will retry with a larger buffer.
 */
function GetSyncInternal(c,jsmd,jsgmo) {

  var mqRc = ref.alloc(MQT.LONG);
  var mqCc = ref.alloc(MQT.LONG);
  var datalen = ref.alloc(MQT.LONG);
  var rc = false;

  var retryTruncation;

  do {
    var mqMd = MQMD._copyMDtoC(jsmd);
    var mqGmo = MQGMO._copyGMOtoC(jsgmo);
    mqGmo.WaitInterval = 0;
    // Make sure that the GMO flags are suitable, regardless of the
    // original request by turning off some options.
    mqGmo.Options &= ~(MQC.MQGMO_WAIT | MQC.MQGMO_ACCEPT_TRUNCATED_MSG);

    retryTruncation = false;
    if (c.buf == null || c.buf.length < c.bufSize) {
      c.buf = Buffer.alloc(c.bufSize);
    }
    var bufflen = 0;
    var ptr = ref.NULL_POINTER;
    if (c.buf) {
      bufflen = c.buf.length;
    }

    if (bufflen > 0) {
      ptr = c.buf;
    }

    libmqm.MQGET(c.object._mqQueueManager._hConn,
                 c.object._hObj,
                 mqMd.ref(),
                 mqGmo.ref(),
                 bufflen,
                 ptr,
                 datalen,
                 mqCc,
                 mqRc);

    MQMD._copyMDfromC(mqMd, jsmd);
    MQGMO._copyGMOfromC(mqGmo, jsgmo);

    var jsRc = mqRc.deref();
    var jsCc = mqCc.deref();
    var jsDatalen = datalen.deref();

    var err = new MQError(jsCc,jsRc,"GET");

    if (c.cb) {
      if (jsCc != MQC.MQCC_OK) {
        if (jsRc == MQC.MQRC_TRUNCATED_MSG_FAILED) {
          // If we need to resize the buffer, then do that and retry.
          retryTruncation = true;
          c.bufSize = c.bufSize * 2;
          if (c.bufSize > maxBufSize) {
            c.bufSize = maxBufSize;
          }
        } else if (jsRc != MQC.MQRC_NO_MSG_AVAILABLE) {
          // If no message is returned, that's OK. Ignore it and carry on,
          // but otherwise call the error handler.
          c.cb(err,c.object);
        }
      } else {
        // Got a message. Call the user's callback function
        c.cb(null,c.object,jsgmo,jsmd,c.buf?c.buf.slice(0,jsDatalen):null);

        c.WaitInterval = c.jsgmo.WaitInterval;
        rc = true;

        // If we have retrieved a message, then look to see if
        // we should reduce the buffer size for next time round on this queue.
        // Using a simple heuristic here, taking 90% of buffer if previous
        // message fit.
        if (c.bufSize > defaultBufSize && ((c.bufSize * 90) / 100 > jsDatalen)); {
          c.bufSize = Math.floor((c.bufSize * 90) / 100);
          if (c.bufSize < defaultBufSize) {
            c.bufSize = defaultBufSize;
          }
        }
      }
    }
  } while(retryTruncation);
  return rc;
}

/**
 * Inq - Inquire on attributes of an object
 *
 * @param {MQObject}
 *        object - reference to the object (hObj)
 * @param {Array.<MQAttr>}
 *        jsSelectors - Array containing the selectors naming the
 *        attributes to look for (MQIA*, MQCA* values). On completion
 *        the array elements are updated with the values.
 * @param {function}
 *        callback - Called when the inquire completes. Parameters are (error, jsSelectors)
 * @throws {MQError}
 *          Container for MQRC and MQCC values
 * @throws {TypeError}
 *          When a parameter is of incorrect type
 */
exports.Inq = function(jsObject,jsSelectors,cb) {
  checkParamCB(cb);
  checkParam(jsObject, MQObject, 'MQObject',true);
  checkArray(jsSelectors);

  var mqRc = ref.alloc(MQT.LONG);
  var mqCc = ref.alloc(MQT.LONG);
  var jsRc;
  var jsCc;
  var i;
  var charAttrLen = 0;
  var charLen;
  var badSelector = false;
  var selector;

  var mqSelectors = new mqLongArray(jsSelectors.length);
  for (i=0;i<jsSelectors.length;i++) {
    checkParam(jsSelectors[i], exports.MQAttr, 'MQAttr',true);
    selector = jsSelectors[i].selector;
    mqSelectors[i] = selector;
    if (selector >= MQC.MQIA_FIRST && selector <= MQC.MQIA_LAST) {
      // Do nothing.
    } else if (selector >= MQC.MQCA_FIRST && selector <= MQC.MQCA_LAST) {
      charLen = mqcaLen(selector);
      if (charLen > 0) {
        charAttrLen += charLen;
      } else {
        badSelector = true;
      }
    } else {
      badSelector = true;
    }
  }

  // Allocate an array of the same length as the selectors in case all
  // are requesting MQIA values. Not all of
  // this array may need to be used, but that's OK.
  var mqIntAttrs = new mqLongArray(jsSelectors.length);

  var ptr = ref.NULL_POINTER;
  if (charAttrLen > 0) {
    ptr = Buffer.alloc(charAttrLen);
  }

  if (!badSelector) {
    libmqm.MQINQ(jsObject._mqQueueManager._hConn, jsObject._hObj,
               mqSelectors.length, mqSelectors,
               mqIntAttrs.length,mqIntAttrs,
               charAttrLen,ptr,mqCc,mqRc);

    jsRc = mqRc.deref();
    jsCc = mqCc.deref();
  } else {
    jsRc = MQC.MQRC_BAD_SELECTOR;
    jsCc = MQC.MQCC_FAILED;
  }

  var err = new MQError(jsCc,jsRc,"INQ");

  if (jsCc != MQC.MQCC_FAILED) {
    var intIndex = 0;
    var charIndex = 0;
    var nameCount = -1;
    for (i=0;i<jsSelectors.length;i++) {
      selector = jsSelectors[i].selector;
      if (selector >= MQC.MQIA_FIRST && selector <= MQC.MQIA_LAST) {
        jsSelectors[i].value = mqIntAttrs[intIndex++];
        if (selector == MQC.MQIA_NAME_COUNT) {
          nameCount = jsSelectors[i].value;
        }
      } else if (selector >= MQC.MQCA_FIRST && selector <= MQC.MQCA_LAST) {
        charLen = mqcaLen(selector,nameCount);
        if (charLen > 0) {
          var b = ptr.slice(charIndex,charIndex+charLen);
          jsSelectors[i].value = u.getMQIString(b);
          charIndex += charLen;
        }
      }
    }
  }

  if (cb) {
    if (jsCc != MQC.MQCC_OK) {
      cb(err, jsSelectors);
    } else {
      cb(null, jsSelectors);
    }
  } else {
    if (jsCc != MQC.MQCC_OK) {
      throw err;
    } else {
      return;
    }
  }
};


/**
 * Set - Set attributes of an object
 *
 * @param {MQObject}
 *        object - reference to the object (hObj) which must refer to a queue.
 * @param {Array<MQAttr>}
 *        jsSelectors - Array containing the attributes (name and value) that
 *        will be changed.
 * @param {function}
 *        callback - Called when the operation completes. Parameters are (error)
 * @throws {MQError}
 *          Container for MQRC and MQCC values
 * @throws {TypeError}
 *          When a parameter is of incorrect type
 */
exports.Set = function(jsObject,jsSelectors,cb) {
  checkParamCB(cb);
  checkParam(jsObject, MQObject, 'MQObject',true);
  checkArray(jsSelectors);

  var mqRc = ref.alloc(MQT.LONG);
  var mqCc = ref.alloc(MQT.LONG);
  var jsCc;
  var jsRc;
  var i;
  var badSelector = false;
  var charAttrLen = 0;
  var charAttr = "";

  var mqSelectors = new mqLongArray(jsSelectors.length);
  // Make the mqIntAttrs array as long as all the selectors; doesn't matter if we
  // don't need to fill it.
  var mqIntAttrs  = new mqLongArray(jsSelectors.length);
  var mqIntAttrsLen = 0;

  for (i=0;i<jsSelectors.length;i++) {
    checkParam(jsSelectors[i], exports.MQAttr, 'MQAttr',true);
    var selector = jsSelectors[i].selector;
    mqSelectors[i] = selector;
    if (selector >= MQC.MQIA_FIRST && selector <= MQC.MQIA_LAST) {
      mqIntAttrs[mqIntAttrsLen++] = jsSelectors[i].value;
    } else if (selector >= MQC.MQCA_FIRST && selector <= MQC.MQCA_LAST) {
      var charLen = mqcaLen(selector);
      if (charLen > 0) {
        charAttr = charAttr + (jsSelectors[i].value + padding256).slice(0,charLen);
      } else {
        badSelector = true;
      }
    } else {
      badSelector = true;
    }
  }

  var ptr = ref.NULL_POINTER;
  if (charAttr != "") {
    charAttrLen = charAttr.length;
    ptr = Buffer.from(charAttr);
  }

  if (!badSelector) {
    libmqm.MQSET(jsObject._mqQueueManager._hConn, jsObject._hObj,
               mqSelectors.length, mqSelectors,
               mqIntAttrsLen,mqIntAttrs,
               charAttrLen,ptr,mqCc,mqRc);

    jsRc = mqRc.deref();
    jsCc = mqCc.deref();
  } else {
    jsRc = MQC.MQRC_SELECTOR_ERROR;
    jsCc = MQC.MQCC_FAILED;
  }

  var err = new MQError(jsCc,jsRc,"SET");

  if (cb) {
    if (jsCc != MQC.MQCC_OK) {
      cb(err);
    } else {
      cb(null);
    }
  } else {
    if (jsCc != MQC.MQCC_OK) {
      throw err;
    } else {
      return;
    }
  }
};

/*
 * This function knows about all of the character attributes that
 * may be used in MQSET/MQINQ so that it can return the length
 * of the appropriate string. The nameCount variable is usually
 * undefined/unused; it only has to be set when looking at a namelist.
 */
function mqcaLen(s,nameCount) {
  var rc = -1;
  switch (s) {
  case MQC.MQCA_TRIGGER_DATA:
    rc = MQC.MQ_TRIGGER_DATA_LENGTH;
    break;
  case MQC.MQCA_Q_MGR_NAME:
  case MQC.MQCA_REMOTE_Q_MGR_NAME:
  case MQC.MQCA_PARENT:
    rc = MQC.MQ_Q_MGR_NAME_LENGTH;
    break;

  case MQC.MQCA_DEAD_LETTER_Q_NAME:
  case MQC.MQCA_BASE_Q_NAME:
  case MQC.MQCA_BACKOUT_REQ_Q_NAME:
  case MQC.MQCA_COMMAND_INPUT_Q_NAME:
  case MQC.MQCA_INITIATION_Q_NAME:
  case MQC.MQCA_DEF_XMIT_Q_NAME:
  case MQC.MQCA_Q_NAME:
  case MQC.MQCA_REMOTE_Q_NAME:
  case MQC.MQCA_XMIT_Q_NAME:
    rc = MQC.MQ_Q_NAME_LENGTH;
    break;

  case MQC.MQCA_ALTERATION_DATE:
  case MQC.MQCA_CREATION_DATE:
    rc = MQC.MQ_DATE_LENGTH;
    break;
  case MQC.MQCA_ALTERATION_TIME:
  case MQC.MQCA_CREATION_TIME:
    rc = MQC.MQ_TIME_LENGTH;
    break;
  case MQC.MQCA_APPL_ID:
   rc = MQC.MQ_APPL_IDENTITY_DATA_LENGTH;
   break;
  case MQC.MQCA_CF_STRUC_NAME:
    rc = MQC.MQ_CF_STRUC_NAME_LENGTH;
    break;
  case MQC.MQCA_CHANNEL_AUTO_DEF_EXIT:
  case MQC.MQCA_CLUSTER_WORKLOAD_EXIT:
    rc = MQC.MQ_EXIT_NAME_LENGTH;
    break;
  case MQC.MQCA_CHINIT_SERVICE_PARM:
    rc = MQC.MQ_CHINIT_SERVICE_PARM_LENGTH;
    break;
  case MQC.MQCA_CLUSTER_NAME:
  case MQC.MQCA_REPOSITORY_NAME:
    rc = MQC.MQ_CLUSTER_NAME_LENGTH;
    break;
  case MQC.MQCA_CLUSTER_WORKLOAD_DATA:
    rc = MQC.MQ_EXIT_DATA_LENGTH;
    break;
  case MQC.MQCA_DNS_GROUP:
    rc = MQC.MQ_DNS_GROUP_NAME_LENGTH;
    break;
  case MQC.MQCA_ENV_DATA:
    rc = MQC.MQ_PROCESS_ENV_DATA_LENGTH;
    break;
  case MQC.MQCA_IGQ_USER_ID:
    rc = MQC.MQ_USER_ID_LENGTH;
    break;
  case MQC.MQCA_INSTALLATION_DESC:
    rc = MQC.MQ_INSTALLATION_DESC_LENGTH;
    break;
  case MQC.MQCA_INSTALLATION_NAME:
    rc = MQC.MQ_INSTALLATION_NAME_LENGTH;
    break;
  case MQC.MQCA_INSTALLATION_PATH:
    rc = MQC.MQ_INSTALLATION_PATH_LENGTH;
    break;
  case MQC.MQCA_LU62_ARM_SUFFIX:
    rc = MQC.MQ_ARM_SUFFIX_LENGTH;
    break;
  case MQC.MQCA_LU_GROUP_NAME:
  case MQC.MQCA_LU_NAME:
    rc = MQC.MQ_LU_NAME_LENGTH;
    break;
  case MQC.MQCA_NAMELIST_DESC:
    rc = MQC.MQ_NAMELIST_DESC_LENGTH;
    break;
  case MQC.MQCA_NAMELIST_NAME:
  case MQC.MQCA_CLUSTER_NAMELIST:
  case MQC.MQCA_REPOSITORY_NAMELIST:
    rc = MQC.MQ_NAMELIST_NAME_LENGTH;
    break;
/*
  This is a variable length, based on the value of the
  corresponding MQIA_NAME_COUNT attribute. We have to assume
  that the input array has that attribute ahead of the MQCA_NAMES
  attribute so we get the count first.
 */
  case MQC.MQCA_NAMES:
    if (nameCount > 0) {
      rc = MQC.MQ_Q_NAME_LENGTH * nameCount;
    }
    break;
  case MQC.MQCA_PROCESS_DESC:
    rc = MQC.MQ_PROCESS_DESC_LENGTH;
    break;
  case MQC.MQCA_PROCESS_NAME:
    rc = MQC.MQ_PROCESS_NAME_LENGTH;
    break;
  case MQC.MQCA_Q_DESC:
    rc =  MQC.MQ_Q_DESC_LENGTH;
    break;
  case MQC.MQCA_Q_MGR_DESC:
    rc =  MQC.MQ_Q_MGR_DESC_LENGTH;
    break;
  case MQC.MQCA_Q_MGR_IDENTIFIER:
    rc = MQC.MQ_Q_MGR_IDENTIFIER_LENGTH;
    break;
  case MQC.MQCA_QSG_NAME:
    rc = MQC.MQ_QSG_NAME_LENGTH;
    break;
  case MQC.MQCA_STORAGE_CLASS:
    rc = MQC.MQ_STORAGE_CLASS_LENGTH;
    break;
  case MQC.MQCA_TCP_NAME:
    rc = MQC.MQ_TCP_NAME_LENGTH;
    break;
  case MQC.MQCA_USER_DATA:
    rc = MQC.MQ_PROCESS_USER_DATA_LENGTH;
    break;

  default:
    rc = -1;
    break;
  }
  return rc;
}

/*********************************************************************
 * Functions to deal with message properties
 */

/**
 * CrtMh - Create a message handle to manage properties
 *
 * @param {MQQueueManager}
 *        queueManager - reference to the queue manager
 * @param {MQCMHO}
 *        cmho - Options for handle creation
 * @param {function}
 *        callback - Called when the operation completes.
 *        Parameters are (error, message handle)
 * @return {Object} The created handle
 * @throws {MQError}
 *          Container for MQRC and MQCC values
 * @throws {TypeError}
 *          When a parameter is of incorrect type
 */
exports.CrtMh = function(jsQueueManager,jscmho, cb) {
  checkParamCB(cb);
  checkParam(jsQueueManager, MQQueueManager, 'MQQueueManager');
  checkParam(jscmho, MQMHO.MQCMHO, 'MQCMHO');

  var mqCmho = MQMHO._copyCMHOtoC(jscmho);
  var mqHMsg  = ref.alloc(MQT.HMSG);
  var mqRc = ref.alloc(MQT.LONG);
  var mqCc = ref.alloc(MQT.LONG);

  libmqm.MQCRTMH(jsQueueManager._hConn,mqCmho.ref(),mqHMsg,mqCc,mqRc);

  var jsRc = mqRc.deref();
  var jsCc = mqCc.deref();
  var jsHMsg = mqHMsg.deref();

  var err = new MQError(jsCc,jsRc,"MQCRTMH");

  if (cb) {
    if (jsCc != MQC.MQCC_OK) {
      cb(err);
    } else {
      cb(null,jsHMsg);
    }
  } else {
    if (jsCc != MQC.MQCC_OK) {
      throw err;
    } else {
      return jsHMsg;
    }
  }
};

/**
 * DltMh - Delete a message handle
 *
 * @param {MQQueueManager}
 *        queueManager - reference to the queue manager
 * @param {Object}
 *        handle - message handle
 * @param {MQDMHO}
 *        dmho - Options for handle deletion
 * @param {function}
 *        callback - Called when the operation completes.
 *        Parameters are (error)
 * @throws {MQError}
 *        Container for MQRC and MQCC values
 * @throws {TypeError}
 *        When a parameter is of incorrect type
 */
exports.DltMh = function(jsQueueManager,jsHMsg,jsdmho, cb) {
  checkParamCB(cb);
  checkParam(jsQueueManager, MQQueueManager, 'MQQueueManager');
  checkParam(jsdmho, MQMHO.MQDMHO, 'MQDMHO');

  var mqHMsg  = ref.alloc(MQT.HMSG, jsHMsg);
  var mqRc = ref.alloc(MQT.LONG);
  var mqCc = ref.alloc(MQT.LONG);
  var mqDmho = MQMHO._copyDMHOtoC(jsdmho);

  libmqm.MQDLTMH(jsQueueManager._hConn,mqHMsg,mqDmho.ref(),mqCc,mqRc);

  var jsRc = mqRc.deref();
  var jsCc = mqCc.deref();

  var err = new MQError(jsCc,jsRc,"MQDLTMH");

  if (cb) {
    if (jsCc != MQC.MQCC_OK) {
      cb(err);
    } else {
      cb(null);
    }
  } else {
    if (jsCc != MQC.MQCC_OK) {
      throw err;
    } else {
      return;
    }
  }
};

/**
 * SetMp - Set a property on a message
 * Use this to set the properties via a message handle, and then
 * pass the message handle as part of the MQPMO structure when putting
 * the message.
 *
 * @param {MQQueueManager}
 *        queueManager - reference to the queue manager
 * @param {Object}
 *        handle - message handle
 * @param {MQSMPO}
 *        smpo - Options for how the property is set
 * @param {String}
 *        name - the property name
 * @param {MQPD}
 *        pd - property descriptor
 * @param {Object}
 *        value - the property value. Can be number, string, boolean or null
 * @param {function}
 *        callback - Called when the operation completes.
 *        Parameters are (error)
 * @throws {MQError}
 *        Container for MQRC and MQCC values
 * @throws {TypeError}
 *        When a parameter is of incorrect type
 */
exports.SetMp = function(jsQueueManager,jsHMsg,jssmpo,name,jspd,value,cb) {
  checkParamCB(cb);
  checkParam(jsQueueManager, MQQueueManager, 'MQQueueManager');
  checkParam(jssmpo, MQMPO.MQSMPO, 'MQSMPO');
  checkParam(jspd  , MQMPO.MQPD  , 'MQPD');
  checkParam(name, 'string', 'string');

  var mqHMsg  = jsHMsg;
  var mqRc = ref.alloc(MQT.LONG);
  var mqCc = ref.alloc(MQT.LONG);
  var mqSmpo = MQMPO._copySMPOtoC(jssmpo);
  var mqPd   = MQMPO._copyPDtoC(jspd);

  var vsName = new MQT.CHARV();
  var ptr;
  var len;
  var type;

  u.defaultCharV(vsName);
  u.setMQICharV(vsName,name);

  // TODO: Handle all the possible MQTYPE values including FLOAT and
  //       different sized ints
  if (typeof value == 'string') {
    ptr = ref.allocCString(value);
    len = value.length;
    type = MQC.MQTYPE_STRING;
  } else if (typeof value == 'number') {
    ptr = ref.alloc(MQT.LONG,value);
    len = 4;
    type = MQC.MQTYPE_INT32;
  } else if (typeof value == 'boolean') {
    ptr = ref.alloc(MQT.LONG,value);
    len = 4;
    type = MQC.MQTYPE_BOOLEAN;
  } else if (value instanceof Buffer) {
    ptr = value;
    len = value.length;
    type = MQC.MQTYPE_BYTE_STRING;
  } else if (!value) {
    ptr = ref.NULL;
    len = 0;
    type = MQC.MQTYPE_NULL;
  } else {
     throw new MQError(MQC.MQCC_FAILED,MQC.MQRC_PROPERTY_TYPE_ERROR,"MQSETMP");
  }

  libmqm.MQSETMP (jsQueueManager._hConn, mqHMsg, mqSmpo.ref(),
           vsName.ref(), mqPd.ref(),
           type, len, ptr,
           mqCc,mqRc);

  var jsRc = mqRc.deref();
  var jsCc = mqCc.deref();

  var err = new MQError(jsCc,jsRc,"MQSETMP");

  if (cb) {
    if (jsCc != MQC.MQCC_OK) {
      cb(err);
    } else {
      cb(null);
    }
  } else {
    if (jsCc != MQC.MQCC_OK) {
      throw err;
    } else {
      return;
    }
  }
};

/**
 * InqMp - Inquire on the values of a message property
 *
 * @param {MQQueueManager}
 *        queueManager - reference to the queue manager
 * @param {Object}
 *        handle - message handle
 * @param {MQIMPO}
 *        impo - Options for how the property is to be queried
 * @param {MQPD}
 *        pd - property descriptor
 * @param {String}
 *        name - the property name
 * @param {Buffer}
 *        value - buffer to be filled in with the property value if it's a
 *        string or byte array
 * @param {function}
 *        callback - Called when the operation completes.
 *        Parameters are (error,name,value,length,type). If the value is
 *        not a simple type (boolean, string, number) then the length and
 *        type parameters can be used for the application to decode the
 *        returned Buffer.
 * @throws {MQError}
 *          Container for MQRC and MQCC values
 * @throws {TypeError}
 *          When a parameter is of incorrect type
 */
exports.InqMp = function(jsQueueManager,jsHMsg,jsImpo,jsPd,jsName,valueBuffer,cb) {
  checkParamCBRequired(cb,true);
  checkParam(jsQueueManager, MQQueueManager, 'MQQueueManager');
  checkParam(jsImpo, MQMPO.MQIMPO, 'MQIMPO');
  checkParam(jsPd  , MQMPO.MQPD  , 'MQPD');
  checkParam(jsName, 'string', 'string');

  var mqHMsg  = jsHMsg;
  var mqRc = ref.alloc(MQT.LONG);
  var mqCc = ref.alloc(MQT.LONG);
  var mqImpo = MQMPO._copyIMPOtoC(jsImpo);
  var mqPd   = MQMPO._copyPDtoC(jsPd);

  var vsName = new MQT.CHARV();
  u.defaultCharV(vsName);
  u.setMQICharV(vsName,jsName);

  // Make sure there's space for the name of the property when it's
  // returned. 1024 ought to be big enough for anyone for now.
  mqImpo.ReturnedName.VSPtr = Buffer.alloc(1024);
  mqImpo.ReturnedName.VSBufSize = 1024;

  // Set up the space for where we will return the property value. Normally
  // this should be set by the calling application as a Buffer but we will
  // try a locally-defined buffer if it's empty.
  var valuePtr;
  var valueLen;
  if (valueBuffer) {
    valuePtr = valueBuffer;
    valueLen = valueBuffer.length;
  } else {
    valuePtr = Buffer.alloc(1024);
    valueLen = 1024;
  }

  var mqType   = ref.alloc(MQT.LONG, MQC.MQTYPE_AS_SET);
  var mqPropsLen = ref.alloc(MQT.LONG);

  libmqm.MQINQMP (jsQueueManager._hConn, mqHMsg, mqImpo.ref(),
           vsName.ref(), mqPd.ref(),
           mqType, valueLen, valuePtr, mqPropsLen,
           mqCc,mqRc);

  var jsRc = mqRc.deref();
  var jsCc = mqCc.deref();
  var jsType = mqType.deref();
  var jsPropsLen = mqPropsLen.deref();
  var returnedName;
  var value;

  var err = new MQError(jsCc,jsRc,"MQINQMP");

  if (jsCc == MQC.MQCC_OK) {
    var enc = mqImpo.ReturnedEncoding;
    var le = ((enc & MQC.MQENC_INTEGER_MASK) == MQC.MQENC_INTEGER_REVERSED);
    returnedName = u.getMQICharV(mqImpo.ReturnedName);

    switch (jsType) {
    case MQC.MQTYPE_NULL:
      value = null;
      break;
    case MQC.MQTYPE_INT8:
      value = valuePtr.readInt8(0);
      break;
    case MQC.MQTYPE_INT16:
      if (le) {
        value = valuePtr.readInt16LE(0);
      } else {
        value = valuePtr.readInt16BE(0);
      }
      break;
    case MQC.MQTYPE_INT32:
      if (le) {
        value = valuePtr.readInt32LE(0);
      } else {
        value = valuePtr.readInt32BE(0);
      }
      break;
    case MQC.MQTYPE_STRING:
      value = ref.reinterpret(valuePtr,jsPropsLen,'utf8');
      break;
    case MQC.MQTYPE_BOOLEAN:
      if (le) {
        value = valuePtr.readInt32LE(0) != 0;
      } else {
        value = valuePtr.readInt32BE(0) !=0 ;
      }
      break;
    default:
      value = valuePtr;
      break;
    }
  }

  if (cb) {
    if (jsCc != MQC.MQCC_OK) {
      cb(err);
    } else {
      cb(null, returnedName,value, jsPropsLen, jsType);
    }
  } else {
    if (jsCc != MQC.MQCC_OK) {
      throw err;
    } else {
      return value;
    }
  }
};

/**
 * DltMp - Delete a message property
 *
 * @param {MQQueueManager}
 *        queueManager - reference to the queue manager
 * @param {Object}
 *        handle - message handle
 * @param {MQDMPO}
 *        dmpo - Options for how the property is to be deleted
 * @param {String}
 *        name - the property name
 * @param {function}
 *        callback - Called when the operation completes.
 *        Parameters are (error)
 * @throws {MQError}
 *        Container for MQRC and MQCC values
 * @throws {TypeError}
 *        When a parameter is of incorrect type
 */
exports.DltMp = function(jsQueueManager,jsHMsg,jsDmpo, jsName, cb) {
  checkParamCB(cb);
  checkParam(jsQueueManager, MQQueueManager, 'MQQueueManager');
  checkParam(jsDmpo, MQMPO.MQDMPO, 'MQDMPO');
  checkParam(jsName, 'string', 'string');

  var mqHMsg  = jsHMsg;
  var mqRc = ref.alloc(MQT.LONG);
  var mqCc = ref.alloc(MQT.LONG);
  var mqDmpo = MQMPO._copyDMPOtoC(jsDmpo);

  var mqName = new MQT.CHARV();
  u.defaultCharV(mqName);
  u.setMQICharV(mqName,jsName);

  libmqm.MQDLTMP (jsQueueManager._hConn, mqHMsg, mqDmpo.ref(), mqName.ref(), mqCc,mqRc);

  var jsRc = mqRc.deref();
  var jsCc = mqCc.deref();

  var err = new MQError(jsCc,jsRc,"MQDLTMP");

  if (cb) {
    if (jsCc != MQC.MQCC_OK) {
      cb(err);
    } else {
      cb(null);
    }
  } else {
    if (jsCc != MQC.MQCC_OK) {
      throw err;
    } else {
      return;
    }
  }
};

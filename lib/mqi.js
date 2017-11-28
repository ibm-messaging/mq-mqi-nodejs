'use strict';
/**
  @copyright Copyright (c) IBM Corporation 2017

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific

  @author Mark Taylor
*/

/**
 * @overview
 * This package exposes the IBM MQ programming interface via
 * a (hopefully) JavaScript-friendly wrapper layer. This should make it
 * easy for a Node.js developer to send and receive messages via MQ, and
 * interact with other MQ-enabled applications in the organisation.
 *
 * The key verbs and parameters are implemented here. Where there
 * are missing details, these are shown by TODO in the text.
 *
 * <p>The package is based on exposing the full MQI. It uses essentially the
 * same verbs and structures as the C or COBOL interface, but with a more
 * natural syntax, removing the need for a JavaScript developer to worry about
 * how to map to the native C libraries.
 * This contrasts with the MQ Light API and MQTT interface
 * that are also available for Node.js, but are tied to a publish/subscribe
 * messaging model.
 *
 * <p>MQ V9.0.4 also incorporates a simple REST API for direct access to
 * the messaging service, but that does not give the full flexibility of
 * the MQI.
 *
 * <p>The verbs implemented here invoke
 * user-supplied callback functions on completion. In all cases, the callbacks
 * are presented with an MQError object as the first parameter when an error
 * or warning occurs (null otherwise), followed by other relevant
 * objects and data. Callbacks are optional. If not supplied, then errors are
 * delivered via exception and other responses are the return value from the
 * function.
 *
 * <p>Unimplemented MQI verbs include MQSET, MQINQ, MQBEGIN, all of the
 * message property controls and MQSUBRQ.
 *
 * <p>All structures are marked as sealed, so that application errors in spelling
 * field names are rejected.
 */

// Import external packages for handling structures and calling C libraries
var ref = require('ref');
var ffi = require('ffi');
var StructType = require('ref-struct');
var ArrayType = require('ref-array');

var util = require('util');

/*
 * Get some basic definitions. The constants (MQC) will be
 * re-exported for users of this module. The types (MQT) are not
 * exported as they should not be used by anyone else directly.
 */
var MQC = require('./mqidefs.js');
exports.MQC = MQC;
var MQT = require('./mqitypes.js');
var mqistrings = require('./mqistrings.js');

/*
 * A few utilities to do type conversions such as string to padded MQCHARxx
 * and back again
 */
var u   = require('./mqiutils.js');

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

/*
 * This is where we give the function prototypes for the
 * C MQI verbs which are called via the Foreign Function
 * Interface. Have to give the verb name, its return datatype,
 * and the parameter datatypes.
 */
var libname='libmqm_r';
if (process.platform === 'win32') {
  libname='mqm';
}
var libmqm = ffi.Library(libname, {
'MQCONNX': ['void', ['pointer', MQT.PHCONN, MQT.PCNO, MQT.PLONG, MQT.PLONG]],
'MQDISC' : ['void', [MQT.PHCONN, MQT.PLONG, MQT.PLONG]],
'MQOPEN' : ['void', [MQT.HCONN, MQT.POD,MQT.LONG,MQT.PHOBJ,MQT.PLONG,MQT.PLONG]],
'MQCLOSE': ['void', [MQT.HCONN, MQT.PHOBJ,MQT.LONG,MQT.PLONG,MQT.PLONG]],
'MQCMIT' : ['void', [MQT.HCONN, MQT.PLONG, MQT.PLONG]],
'MQBACK' : ['void', [MQT.HCONN, MQT.PLONG, MQT.PLONG]],
'MQPUT'  : ['void', [MQT.HCONN, MQT.HOBJ,MQT.PMD,MQT.PPMO,MQT.LONG, 'pointer',MQT.PLONG, MQT.PLONG]],
'MQPUT1' : ['void', [MQT.HCONN, MQT.POD, MQT.PMD, MQT.PPMO, MQT.LONG, 'pointer',MQT.PLONG, MQT.PLONG]],
'MQGET'  : ['void', [MQT.HCONN, MQT.HOBJ,MQT.PMD, MQT.PGMO,MQT.LONG, 'pointer',MQT.PLONG, MQT.PLONG, MQT.PLONG]],
'MQSUB'  : ['void', [MQT.HCONN, MQT.PSD, MQT.PHOBJ,MQT.PHOBJ,MQT.PLONG,MQT.PLONG]],
'MQCTL'  : ['void', [MQT.HCONN, MQT.LONG, MQT.PCTLO,MQT.PLONG,MQT.PLONG]],
'MQCB'   : ['void', [MQT.HCONN, MQT.LONG, MQT.PCBD,MQT.HOBJ,MQT.PMD,MQT.PGMO,MQT.PLONG,MQT.PLONG]],
});

/**
 * MQQueueManager contains the connection to the queue manager. Fields
 * are not meant to be directly referenced by user applications..
 * @class
 */
function MQQueueManager(hConn,name) {
  this._hConn = hConn;
  this._name = name;
  Object.seal(this);
}

/**
 * MQObject contains a reference to an open object and the associated
 * queue manager. Fields are not meant to be directly referenced by
 * user applications. Combining hConn and hObj in a single object means
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
 * MQError holds the MQRC and MQCC values returned from an MQI verb.
 * For convenience, it also holds the name of the verb that failed.
 * It is a subclass of Error().
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
  /** @member {number} */
  this.mqrc = mqrc;
  /** @member {String} */
  this.verb = verb; // A string such as "PUT" or "CMIT"
  Object.seal(this);
}
util.inherits(MQError, Error);

/*
 * Check that the callback parameter (if supplied) is valid.
 * Throw an exception if it is not.
 */
function checkParamCB(cb) {
  if (cb && (typeof cb !== 'function')) {
    var err = new TypeError('Callback must be a function');
    throw err;
  }
}

/*
 * Generic type checkers for MQI parameters passed from user applications.
 * @param {Object} b - object to check
 * @param {Type} t - expected type
 * @param {String} m - type shown in error
 * @param {boolean} optional - if false, object b must not be null.
 * @throws {TypeError}
 */
function checkParamOptional(b, t, m, optional) {
  if (!optional && b == null) {
    throw new TypeError('Parameter of type ' + m + ' must be provided');
  }
  // Handle basic types first
  if (t == 'number') {
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

function checkParam(b,t,m) {
  checkParamOptional(b,t,m,false);
}

// A set of functions to deal with storing state across
// MQGET callbacks.
var contextMap = new Map();
function UserContext(o,cb,cbArea) {
  this.cb = cb;
  this.object = o;
  this.cbArea = cbArea;
  this.inCB = false;
}

// The key to the map is a combination of the hObj and hConn, which will
// be unique in this process.
function getKey(jsObject) {
  var rc;
  if (jsObject) {
    rc = jsObject._hObj + "/" + jsObject._mqQueueManager._hConn;
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
     var x= mqistrings[f](val);
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
  checkParamOptional(jsCno, MQCNO.MQCNO, 'MQCNO',true);

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

  // Deal with empty qmgrName for default connection
  var mqqMgrName = ref.NULL_POINTER;
  if (jsqMgrName.length > 0) {
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
  checkParamOptional(jsQueueManager, MQQueueManager, 'MQQueueManager',true);

  var jsRc = MQC.MQRC_NONE;
  var jsCc = MQC.MQCC_OK;

  if (jsQueueManager) {
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
  checkParamOptional(jsObject, MQObject, 'MQObject',true);
  checkParam(jsCloseOptions,'number','number');

  var jsRc = MQC.MQCC_OK;
  var jsCc = MQC.MQRC_NONE;

  if (jsObject) {
    var mqHObj  = ref.alloc(MQT.HOBJ, jsObject._hObj);
    var mqRc = ref.alloc(MQT.LONG);
    var mqCc = ref.alloc(MQT.LONG);

    libmqm.MQCLOSE(jsObject._mqQueueManager._hConn,mqHObj,jsCloseOptions, mqCc,mqRc);

    jsObject._hObj = mqHObj.deref();

    jsRc = mqRc.deref();
    jsCc = mqCc.deref();
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
exports.Sub = function(jsQueueManager,jsQueueObject,jssd,cb) { //-> fil in Hobj if managed, Hsub describing subscription
  checkParamCB(cb);
  checkParam(jsQueueManager, MQQueueManager, 'MQQueueManager');
  checkParamOptional(jsQueueObject, MQObject,'MQObject',true);
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
  checkParam(jsmd, MQOD.MQOD, 'MQOD');
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


/**
 * Get -  Get a message from a queue asynchronously. Use GetDone()
 * to clear the callback. No data buffer needs to be supplied as input
 * to this function, but message data should be processed or copied
 * before returning from your callback as the buffer may get overwritten
 * by any subsequent message.
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
  if (!cb || (typeof cb !== 'function')) {
    var err = new TypeError('Callback must be a function');
    throw err;
  }

  var jscbd = new MQCBD.MQCBD();
  setUserContext(jsObject,cb); // Save information needed for the callback

  try {
    callbackRegistration(MQC.MQOP_REGISTER,jsObject,jscbd,jsmd,jsgmo);
    callbackControl(jsObject, MQC.MQOP_START);
  } catch (err) {
    if (cb) {
      cb(err);
    } else {
      throw err;
    }
  }
};

/**
 * GetDone -  Stop the Get processing by removing the listener
 * for more messages.
 * <p>This must not be called directly from within the callback message receiver.
 * It can however be scheduled from within that receiver via setImmediate().
 * That is not being done here because we can't tell what other work the
 * receiver is going to do, so setImmediate() may still not be executed
 * late enough.
 * <p>It has to be after the real callback has returned because of
 * the MQ thread controls - MQ thinks it has called us on thread X while
 * the code really ends up executing on thread Y, which is blocked from
 * MQI operations until MQ thinks the processing on X has finished.
 *
 * @param {MQObject}
 *        jsObject - reference to the opened object (hConn and hObj)
 * @param {function}
 *        callback - optional. Invoked for errors. Length of returned data
 *        passed on success.
 * @throws {MQError}
 *         Container for MQRC and MQCC values
 * @throws {TypeError}
 *         When a parameter is of incorrect type
 */
exports.GetDone = function(jsObject, cb) {
  var jscbd = new MQCBD.MQCBD();

  var userContext = getUserContext(jsObject);
  if (userContext && userContext.inCB) {
    var err = new MQError(MQC.MQCC_FAILED,MQC.MQRC_HCONN_ASYNC_ACTIVE,"GetDone");
    throw err;
  }

  deleteUserContext(jsObject);

  try {
    if (jsObject) {
      callbackControl(jsObject, MQC.MQOP_STOP);
      callbackRegistration(MQC.MQOP_DEREGISTER,jsObject,jscbd);
    }
  } catch (err) {
    if (cb) {
       cb(err);
    } else {
      throw err;
    }
  }
  if (cb) {
    cb(null);
  }
};


/*
 * Function mqiCB - the internal callback function driven
 * from MQCB/MQCTL when a new message arrives on the queue.
 *
 * <p>Calls the user-supplied callback function with the message
 * and control information.
 *
 * <p>TODO: What about event callbacks, not just messages.
 */
function mqiCB(hConn,pmqmd,pmqgmo,pbuf,pmqcbc) {

  var jsmd = new MQMD.MQMD();
  var jsgmo = new MQGMO.MQGMO();
  var jscbc = new MQCBC.MQCBC();

  var mqcbc = ref.deref(pmqcbc);
  var mqmd;
  var mqgmo;
  var buf = null;

  MQCBC._copyCBCfromC(mqcbc, jscbc);
  var callType = mqcbc.CallType;
  var err = new MQError(mqcbc.CompCode, mqcbc.Reason, "MQCallback");

  // Only try to parse the MD and GMO structures if there is a message involved.
  // There may also be EVENT callbacks. In that case, we will create an error (throw
  // exception) with the MQRC/MQCC values.
  if (callType == MQC.MQCBCT_MSG_REMOVED || callType == MQC.MQCBCT_MSG_NOT_REMOVED) {
    if (!ref.isNull(pmqmd)) {
      mqmd = ref.deref(pmqmd);
      MQMD._copyMDfromC(mqmd, jsmd);
    }
    if (!ref.isNull(pmqgmo)) {
      mqgmo = ref.deref(pmqgmo);
      MQGMO._copyGMOfromC(mqgmo, jsgmo);
    }
  }

  var len = jscbc.DataLength;
  if (len != 0) {
    buf = ref.reinterpret(pbuf,len);
  }

  var p = mqcbc.CallbackArea;
  var jsObject = null;
  try {
    jsObject = p?JSON.parse(ref.readCString(p)):null;
  } catch (err) {
  }

  var c = getUserContext(jsObject);
  if (c) {
    c.inCB = true;
    try {
      if (mqcbc.CompCode != MQC.MQCC_OK) {
        c.cb(err,c.object);
      } else {
        c.cb(null,c.object,jsgmo,jsmd,buf?buf.slice(0,len):null);
      }
      c.inCB = false;
    } catch (err) {
      c.inCB = false;
      throw err;
    }
  } else {
    // Get here when we appear to already be in the middle of an MQI call or
    // cannot understand the object that is being processed.
    err = new MQError(MQC.MQCC_FAILED,MQC.MQRC_HCONN_ERROR,"MQCallback");
    throw err;
  }
}

/*
 * Setup how our callback will be invoked from the C library
 */
var fficb = ffi.Callback('void',
                         [MQT.HCONN,MQT.PMD,MQT.PGMO,MQT.PTR,MQT.PCBC],
                          mqiCB);
/*
 * Add a reference to the callback to avoid GC
 */
process.on('exit',function(){fficb;});

/*
 * Function - callbackRegistration. The internal call to MQCB
 * that registers the callback to be invoked asynchronously. As
 * an internal call, there's no cb parameter.
 */
function callbackRegistration(op,jsObject,jscbd,jsmd,jsgmo) {
  checkParam(jsObject,MQObject, 'MQObject');

  var mqMd;
  var mqCbd;
  var mqGmo;

  if (op == MQC.MQOP_REGISTER) {
    checkParam(jsmd, MQMD.MQMD, 'MQMD');
    checkParam(jsgmo, MQGMO.MQGMO, 'MQGMO');
    checkParam(jscbd, MQCBD.MQCBD, 'MQCBD');

    mqMd = MQMD._copyMDtoC(jsmd);
    mqCbd = MQCBD._copyCBDtoC(jscbd);
    mqGmo = MQGMO._copyGMOtoC(jsgmo);

    // Serialise the hconn/hobj object so we can get it back later and
    // use it for locating the correct callback function.
    mqCbd.CallbackArea = ref.allocCString(JSON.stringify(jsObject));
    mqCbd.CallbackFunction = fficb;
  } else {
    mqMd = null;
    mqCbd = null;
    mqGmo = null;
  }

  var mqRc = ref.alloc(MQT.LONG);
  var mqCc = ref.alloc(MQT.LONG);
  var datalen = ref.alloc(MQT.LONG);

  libmqm.MQCB(jsObject._mqQueueManager._hConn,
       op,
       mqCbd?mqCbd.ref():ref.NULL,
       jsObject._hObj,
       mqMd?mqMd.ref():ref.NULL,
       mqGmo?mqGmo.ref():ref.NULL,
       mqCc,
       mqRc);

  var jsRc = mqRc.deref();
  var jsCc = mqCc.deref();
  var err = new MQError(jsCc,jsRc,"CB");

  if (jsCc != MQC.MQCC_OK) {
    throw err;
  } else {
    return;
  }

}

/*
 * Function - callbackControl. The wrapper around MQCTL to start
 * and stop consumption of messages. As an internal function, there's
 * no cb parameter.
 */
function callbackControl(jsObject,op) {
  checkParam(jsObject, MQObject, 'MQObject',true);

  var mqRc = ref.alloc(MQT.LONG);
  var mqCc = ref.alloc(MQT.LONG);

  var jsctlo = new MQCTLO.MQCTLO();
  var mqctlo = MQCTLO._copyCTLOtoC(jsctlo);

  libmqm.MQCTL(jsObject._mqQueueManager._hConn,op,mqctlo.ref(),mqCc,mqRc);

  var jsRc = mqRc.deref();
  var jsCc = mqCc.deref();
  var err = new MQError(jsCc,jsRc,"CTL");

  if (jsCc != MQC.MQCC_OK) {
    throw err;
  } else {
    return;
  }
}

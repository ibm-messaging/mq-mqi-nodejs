'use strict';
/*
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
    Mohammed Asif - Provided model for fully-async functions

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
 * messaging model. MQ also incorporates a simple REST API for direct access to
 * the messaging service, but that too does not give the full flexibility of
 * the MQI.
 *
 * <p>The verbs implemented here invoke
 * user-supplied callback functions on completion. In all cases, the callbacks
 * are presented with an MQError object as the first parameter when an error
 * or warning occurs (null otherwise), followed by other relevant
 * objects and data. Callbacks are optional in some verbs. If not supplied, then errors are
 * delivered via exception and other responses are the return value from the
 * function. Where multiple items need to be returned to the caller, a callback function is
 * mandatory.
 *
 * <p>All structures are marked as sealed, so that application errors in spelling
 * field names are rejected.
 *
 * <p>Sample programs are included with the package to demonstrate how to use it.
 * See {@link https://marketaylor.synology.me/?p=505|here} for
 * more discussion of the interface.
 *
 * @author Mark Taylor
 * @copyright Copyright (c) IBM Corporation 2017, 2023
 */

const mqnapi = require('../build/Release/ibmmq_native');

const util = require('util');
const path = require('path');

/*
 * Get some basic definitions. The constants (MQC) will be
 * re-exported for users of this module. 
 */
const MQC = require('./mqidefs.js');
exports.MQC = MQC;

/*
 * Start to refer to specific types that are re-exported from here with
 * just the structure definition exposed for external reference.
 */
const MQMD = require('./mqmd.js');
exports.MQMD = MQMD.MQMD;

const MQCD = require('./mqcd.js');
exports.MQCD = MQCD.MQCD;
const MQCNO = require('./mqcno.js');
exports.MQCNO = MQCNO.MQCNO;
const MQCSP = require('./mqcsp.js');
exports.MQCSP = MQCSP.MQCSP;
const MQGMO = require('./mqgmo.js');
exports.MQGMO = MQGMO.MQGMO;
const MQOD = require('./mqod.js');
exports.MQOD = MQOD.MQOD;
const MQPMO = require('./mqpmo.js');
exports.MQPMO = MQPMO.MQPMO;
const MQSCO = require('./mqsco.js');
exports.MQSCO = MQSCO.MQSCO;
const MQSD = require('./mqsd.js');
exports.MQSD = MQSD.MQSD;
const MQSRO = require('./mqsro.js');
exports.MQSRO = MQSRO.MQSRO;
const MQSTS = require('./mqsts.js');
exports.MQSTS = MQSTS.MQSTS;
const MQBNO = require('./mqbno.js');
exports.MQBNO = MQBNO.MQBNO;



/* Export the message property APIs and structures
 */
const MQMHO = require('./mqmho.js');
const MQMPO = require('./mqmpo.js');

exports.MQCMHO = MQMHO.MQCMHO;
exports.MQDMHO = MQMHO.MQDMHO;
exports.MQIMPO = MQMPO.MQIMPO;
exports.MQSMPO = MQMPO.MQSMPO;
exports.MQDMPO = MQMPO.MQDMPO;
exports.MQPD = MQMPO.MQPD;

/* Some application structures that we
   explicitly convert between
 */ 
const MQSTRUC = require('./mqstruc.js');
exports.MQDLH = MQSTRUC.MQDLH;
exports.MQRFH2 = MQSTRUC.MQRFH2;

var mqt = require('./mqitypes.js');
const checkParamCB = mqt.checkParamCB;
const checkParamCBRequired = mqt.checkParamCBRequired;
const checkParam = mqt.checkParam;
const checkParamRequired = mqt.checkParamRequired;
const checkParamArray = mqt.checkParamArray;
const checkArray = mqt.checkArray;
exports.Lookup = mqt.Lookup;

exports.MQQueueManager = mqt.MQQueueManager;
const MQQueueManager = mqt.MQQueueManager;
exports.MQObject = mqt.MQObject;
const MQObject = mqt.MQObject;
exports.MQAttr = mqt.MQAttr;
const MQAttr = mqt.MQAttr;
exports.MQError = mqt.MQError;
const MQError = mqt.MQError;


var GetAsync = require('./mqigeta.js');
exports.GetDone = GetAsync.GetDone;
exports.Ctl = GetAsync.Ctl;

exports.setTuningParameters = GetAsync.setTuningParameters;
exports.getTuningParameters = GetAsync.getTuningParameters;

const isLocked = GetAsync.isLocked;
const lock = GetAsync.lock;
const unlock = GetAsync.unlock;

/*
* A simple logging package for trace/debug
*/
var log = require('./mqilogger.js');

/*
 * Call the native library with some platform/environment information. 
 */
var logLevel; // For the C++ layer
if (process.env['MQIJS_OBJECT'] != null) {
  logLevel = 3;
  process.env['MQIJS_TRACE'] = "true";
} else if (process.env['MQIJS_TRACE'] != null)
  logLevel = 2;
else if (process.env['MQIJS_DEBUG'] != null)
  logLevel = 1;
else
  logLevel = 0;

mqnapi.Configure({
  "logLevel": logLevel,
  "noopFn": _noop,
  "platform": process.platform,
  "arch": process.arch,
  "littleEndian": ((MQC.MQENC_NATIVE & MQC.MQENC_INTEGER_MASK) == MQC.MQENC_INTEGER_REVERSED),
});

// Try to load the MQ runtime library.
// The default behaviour is to try first in the version of the MQ libraries that
// may be installed under the node_modules directory from a downloaded Redistributable Client
// package.
// If that downloaded client does not exist (by choice, or running on a platform without that package),
// then look in various other places:
// - the default load path which might have been set by setmqenv
// - standard installation directories for the platform
//
// The drawback to using the Redist client package by default is that you cannot connect using local
// bindings to a local queue manager - you MUST use a CLNTCONN channel with its definitions.
//
// To make it practical to use local queue managers for some activity, this behaviour can be overridden via
// an environment variable MQIJS_PREFER_INSTALLED_LIBRARY in which case the Redist directory is tried LAST.
// We cannot use a tuning parameter as this function is executed as this module is loaded - the tuning
// parm could only be set later.
//
// Note the use of '__dirname' which is a system-provided variable pointing at the directory
// from which this module has been loaded.
//
// Throw an exception if the library cannot be loaded.
function loadLibMulti() {
  var l;
  var err;
  var p;
  var ldPath;
  var newLdPath;

  var searchRedistFirst = process.env['MQIJS_PREFER_INSTALLED_LIBRARY'] == null;
  log.traceEntry('loadLib');

  if (process.platform === 'win32') {
    l = 'mqm';

    p = path.join(__dirname, "../redist", "bin64");
    ldPath = process.env['PATH'];
    newLdPath = p;
    if (ldPath != null) {
      newLdPath = p + ";" + ldPath;
    }

    // Have to update the PATH environment for Windows to find dependencies
    if (searchRedistFirst) {
      process.env['PATH'] = newLdPath;
      err = mqnapi.LoadLib(p, l);
    }

    // Try default directory, known from PATH (setmqenv may have put MQ in there)
    if (err || !searchRedistFirst) {
      if (ldPath != null) { // reset the PATH back to its original value
        process.env['PATH'] = ldPath;
      }
      err = mqnapi.LoadLib(null, l);
    }
    // Try standard installation directories for MQ
    if (err) {
      err = mqnapi.LoadLib("C:\\Program Files\\IBM\\MQ\\bin64", l);
    }
    if (err) {
      err = mqnapi.LoadLib("C:\\Program Files\\IBM\\MQ\\bin", l);
    }
    if (err && !searchRedistFirst) {
      process.env['PATH'] = newLdPath;
      err = mqnapi.LoadLib(p, l);
    }
  } else {
    l = 'libmqm_r';

    var prefix="/opt";
    if (process.platform == "aix") {
      prefix="/usr";
    }    
      

    p = path.join(__dirname, "../redist", "lib64");
    if (searchRedistFirst) {
      err = mqnapi.LoadLib(p, l);
    }

    // Try default directory, known from LD_LIBRARY_PATH (setmqenv may have put MQ in there)
    if (err || !searchRedistFirst) {
      err = mqnapi.LoadLib(null, l);
    }
    // Try standard installation directories for MQ
    if (err) {
      err = mqnapi.LoadLib(prefix + "/mqm/lib64", l);
    }
    if (err) {
      err = mqnapi.LoadLib(prefix + "/mqm/lib64/compat", l);
    }
    if (err) {
      err = mqnapi.LoadLib(prefix + "/mqm/lib", l);
    }
    if (err && !searchRedistFirst) {
      err = mqnapi.LoadLib(p, l);
    }
  }
  if (err) {
    console.error("Cannot find MQ C library.");
    console.error("  System appears to be: " + process.platform + "[" + process.arch + "]");
    console.error("  Has the MQ C client been installed?");
    if (process.platform === 'darwin') {
      console.error("  Have you set DYLD_LIBRARY_PATH?");
    } else {
      console.error("  Have you run setmqenv?");
    }
    log.traceExitErr('LoadLibMulti', err);
    throw err;
  }
  log.traceExit('LoadLibMulti');
}

loadLibMulti();


/*
 * This function is used as a dummy callback to simplify the NAPI C++ routines. It
 * ought never to be called.
 */
function _noop(o) {
  console.error("The No-Op callback has been called with ", o);
}
/*
 * And now start to export the real MQI functions as
 * JavaScript methods. The callbacks are all invoked with an MQError(mqrc,mqcc)
 * object when there is an error or warning.
 */


/**
 * Connx, ConnxSync - callback is passed object containing the hConn on success.
 *
 * @param {String}
 *        qMgrName - the queue manager to connect to
 * @param {MQCNO}
 *        cno - connection options
 * @param {function}
 *        callback - optional for sync variant. Invoked for errors and
 *        with a reference to the qmgr connection.
 * @return {MQQueueManager} A reference to the connection
 * @throws {MQError}
 *         Container for MQRC and MQCC values
 * @throws {TypeError}
 *         When a parameter is of incorrect type
 */

exports.ConnxSync = function (jsqMgrName, jscno, cb) {
  log.traceEntry('ConnxSync');
  checkParamCB(cb);

  var hConn = _connx(jsqMgrName, jscno, false, cb);
  log.traceExit('ConnxSync');
  if (!cb) {
    return hConn;
  }
};

exports.Connx = function (jsqMgrName, jscno, cb) {
  log.traceEntry('Connx');
  checkParamCBRequired(cb, true);

  var hConn = _connx(jsqMgrName, jscno, true, cb);
  log.traceExit('ConnxSync');
  if (!cb) {
    return hConn;
  }
};

/**
 * Conn, ConnSync - simpler version of Connx.
 * The callback is passed object containing the hConn on success
 *
 * @param {String}
 *        qMgrName - the queue manager to connect to
 * @param {function}
 *        callback - optional for sync variant. Invoked for errors and
 *        with a reference to the qmgr connection.
 * @return {MQQueueManager) A reference to the connection
* @throws {MQError}
*         Container for MQRC and MQCC values
* @throws {TypeError}
*         When a parameter is of incorrect type
*/
exports.ConnSync = function (jsqMgrName, cb) {
  log.traceEntry('ConnSync');
  var hConn = _connx(jsqMgrName, null, false, cb);
  log.traceExit('ConnSync');
  if (!cb) {
    return hConn;
  }
};

exports.Conn = function (jsqMgrName, cb) {
  log.traceEntry('Conn');
  var hConn = _connx(jsqMgrName, null, true, cb);
  log.traceExit('Conn');
  if (!cb) {
    return hConn;
  }
};

function _connx(jsqMgrName, jscno, async, cb) {
  var result = {};
  var jsRc = -1, jsCc = -1;
  var hConn;
  var savedOptions;
  var savedBnoOptions;

  log.traceEntry('_connx');

  checkParamRequired(jscno, MQCNO.MQCNO, 'MQCNO', false);
  if (jsqMgrName == null || jsqMgrName.length == 0) {
    jsqMgrName = "";
  }

  /* Make sure there's at least a default CNO so that    */
  /* we can force-set the threading option appropriately */
  if (jscno == null) {
    jscno = new MQCNO.MQCNO();
  }

  savedOptions = jscno.Options;
  var options = mqt.flagsToNumber('MQCNO', jscno.Options);
  // Make sure the right threading option is set
  if ((options & (MQC.MQCNO_HANDLE_SHARE_NO_BLOCK |
    MQC.MQCNO_HANDLE_SHARE_BLOCK)) == 0) {
    options |= MQC.MQCNO_HANDLE_SHARE_BLOCK;
  }

  jscno.Options = options;

  var jscsp = jscno.SecurityParms;
  if (jscsp != null) {
    if (!(jscsp instanceof MQCSP.MQCSP)) {
      throw new TypeError('Parameter must be of type MQCSP');
    }
  }
  var jscd = jscno.ClientConn;
  if (jscd != null) {
    if (!(jscd instanceof MQCD.MQCD)) {
      throw new TypeError('Parameter must be of type MQCD');
    }

    // Turn host:port into host(port) if necessary
    // Many people use the more common format by mistake with MQ and
    // are then surprised it doesn't work.
    if (jscd.ConnectionName != null) {
      var s = jscd.ConnectionName;
      if (s.indexOf(":") >= 0) {
        var f = s.split(":");
        if (f.length != 2) {
          throw new TypeError("ConnectionName has incorrect format");
        }
        jscd.ConnectionName = f[0] + "(" + f[1] + ")";
      }
    }
  }
  var jssco = jscno.SSLConfig;
  if (jssco != null) {exports.MQError = mqt.MQError;
    const MQError = mqt.MQError;
    
    if (!(jssco instanceof MQSCO.MQSCO)) {
      throw new TypeError('Parameter must be of type MQSCO');
    }
  }
  var jsbno = jscno.BalanceParms;
  if (jsbno != null) {
    if (!(jsbno instanceof MQBNO.MQBNO)) {
      throw new TypeError('Parameter must be of type MQBNO');
    }
    savedBnoOptions = jsbno.Options;
    jsbno.Options = mqt.flagsToNumber('MQCNO', jscno.Options);
  }

  if (async) {
    mqnapi.Connx(jsqMgrName, jscno, function (result) {
      jsRc = result.jsRc;
      jsCc = result.jsCc;
      if (jscno != null) {
        jscno.Options = savedOptions;
      }

      if (jsbno != null) {
        jsbno.Options = savedBnoOptions;
      }

      // If it did not work, create an MQError object with the reason codes,
      // otherwise invoke the callback with the hConn-containing object.
      hConn = new MQQueueManager(result.jsHConn, jsqMgrName);
      var err = new MQError(jsCc, jsRc, 'CONNX');
      if (jsCc != MQC.MQCC_OK) {
        cb(err, null);
      } else {
        cb(null, hConn);
      }
    });
  } else {
    result = mqnapi.Connx(jsqMgrName, jscno);

    jsRc = result.jsRc;
    jsCc = result.jsCc;

    if (jscno != - null) {
      jscno.Options = savedOptions;
    }

    if (jsbno != null) {
      jsbno.Options = savedBnoOptions;
    }

    // If it did not work, create an MQError object with the reason codes,
    // otherwise invoke the callback with the hConn-containing object.
    hConn = new MQQueueManager(result.jsHConn, jsqMgrName);

    // If it did not work, create an MQError object with the reason codes,
    // otherwise invoke the callback with the hConn-containing object.
    // var hConn = new MQQueueManager(jsHConn,jsqMgrName);
    var err = new MQError(jsCc, jsRc, 'CONNX');

    if (cb) {
      if (jsCc != MQC.MQCC_OK) {
        cb(err, null);
      } else {
        cb(null, hConn);
      }
    } else {
      if (jsCc != MQC.MQCC_OK) {
        log.traceExitErr('_connx', err);
        throw err;
      } else {
        log.traceExit('_connx');
        return hConn;
      }
    }
  }
}

/**
 * Disc, DiscSync - Disconnect from the queue manager.
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
exports.DiscSync = function (jsQueueManager, cb) {
  log.traceEntry('DiscSync');
  checkParamCB(cb);
  _disc(jsQueueManager, false, cb);
  log.traceExit('DiscSync');
};
exports.Disc = function (jsQueueManager, cb) {
  log.traceEntry('Disc');
  checkParamCBRequired(cb, true);
  _disc(jsQueueManager, true, cb);
  log.traceExit('Disc');
};

function _disc(jsQueueManager, async, cb) {
  log.traceEntry('_disc');
  checkParamRequired(jsQueueManager, MQQueueManager, 'MQQueueManager', false);

  discInternal();

  function discInternal() {

    var jsRc = MQC.MQRC_NONE;
    var jsCc = MQC.MQCC_OK;
    var savedHConn = null;
    var err;

    log.traceEntry('discInternal');

    if (!jsQueueManager) {

      jsRc = MQC.MQRC_HCONN_ERROR;
      jsCc = MQC.MQCC_FAILED;
      err = new MQError(jsCc, jsRc, "DISC");

      if (cb) {
        var o = cb(err);
        log.traceExitErr('discInternal', err);
        return o;
      } else {
        log.traceExit('discInternal', err);
        throw err;
      }
    }

    // check if hConn is already being used
    if (isLocked(jsQueueManager._hConn)) {
      log.traceExit('discInternal', 'isLocked');
      return setImmediate(discInternal);
    } else {
      lock(jsQueueManager._hConn);
    }

    savedHConn = jsQueueManager._hConn;
    if (async) {
      mqnapi.Disc(savedHConn, function (result) {
        // remove the hConn
        unlock(jsQueueManager._hConn);

        jsQueueManager._hConn = result.jsHConn;
        jsRc = result.jsRc;
        jsCc = result.jsCc;

        if (savedHConn != -1) {
          GetAsync.deleteUserConnection(savedHConn);
        }

        err = new MQError(jsCc, jsRc, "DISC");

        if (jsCc != MQC.MQCC_OK) {
          cb(err);
        } else {
          cb(null);
        }
      });
    } else {
      var result = mqnapi.Disc(savedHConn);

      // remove the hConn
      unlock(jsQueueManager._hConn);

      jsQueueManager._hConn = result.jsHConn;
      jsRc = result.jsRc;
      jsCc = result.jsCc;

      if (savedHConn != -1) {
        GetAsync.deleteUserConnection(savedHConn);
      }

      err = new MQError(jsCc, jsRc, "DISC");

      if (cb) {
        if (jsCc != MQC.MQCC_OK) {
          cb(err);
        } else {
          cb(null);
        }
      } else {
        if (jsCc != MQC.MQCC_OK) {
          log.traceExitErr('discInternal', err);
          throw err;
        } else {
          log.traceExit('discInternal');
          return;
        }
      }
    }
    log.traceExit('discInternal');
  }
  log.traceExit('_disc');
}


/**
 * Open, OpenSync - Open an object such as a queue or topic.
 *
 * @param {MQQueueManager}
 *        queueManager - reference to the queue manager (hConn)
 * @param {MQOD}
 *        jsod - MQ Object Descriptor including the name and
 *        type of object to open
 * @param {number}
 *        openOptions - how the object is intended to be used.
 * @param {function}
 *        callback - Required. Invoked for errors and given a
 *        reference to the opened object on success.
 * @return {MQObject} A reference to the opened object (hObj)
 * @throws {MQError}
 *          Container for MQRC and MQCC values
 * @throws {TypeError}
 *          When a parameter is of incorrect type
 */
exports.OpenSync = function (jsQueueManager, jsod, jsOpenOptions, cb) {
  log.traceEntry('OpenSync');
  checkParamCB(cb);
  open(jsQueueManager, jsod, jsOpenOptions, false, cb);
  log.traceExit('OpenSync');
};

exports.Open = function (jsQueueManager, jsod, jsOpenOptions, cb) {
  log.traceEntry('Open');
  checkParamCBRequired(cb, true);
  open(jsQueueManager, jsod, jsOpenOptions, true, cb);
  log.traceExit('Open');
};

function open(jsQueueManager, jsod, jsOpenOptions, async, cb) {
  log.traceEntry('open');
  checkParam(jsQueueManager, MQQueueManager, 'MQQueueManager');
  checkParam(jsod, MQOD.MQOD, 'MQOD');
  checkParamArray(jsOpenOptions, 'number', 'number');

  openInternal();

  function openInternal() {
    log.traceEntry('openInternal');

    var jsRc = MQC.MQRC_NONE;
    var jsCc = MQC.MQCC_OK;
    var err;

    // check if hConn is already being used
    if (isLocked(jsQueueManager._hConn)) {
      log.traceExit('openInternal');
      return setImmediate(openInternal);
    } else {
      lock(jsQueueManager._hConn);
    }

    if (async) {
      mqnapi.Open(jsQueueManager._hConn, jsod, mqt.flagsToNumber('MQOO', jsOpenOptions), function (result) {
        unlock(jsQueueManager._hConn);
        jsRc = result.jsRc;
        jsCc = result.jsCc;

        var jsObject = new MQObject(result.jsHObj, jsQueueManager, jsod.ObjectName);
        err = new MQError(jsCc, jsRc, "OPEN");

        if (jsCc != MQC.MQCC_OK) {
          cb(err, null);
        } else {
          cb(null, jsObject);
        }
      });
    } else {
      var result = mqnapi.Open(jsQueueManager._hConn, jsod, mqt.flagsToNumber('MQOO', jsOpenOptions));
      unlock(jsQueueManager._hConn);

      jsRc = result.jsRc;
      jsCc = result.jsCc;

      var jsObject = new MQObject(result.jsHObj, jsQueueManager, jsod.ObjectName);
      err = new MQError(jsCc, jsRc, "OPEN");

      if (jsCc != MQC.MQCC_OK) {
        cb(err, null);
      } else {
        cb(null, jsObject);
      }
    }
    log.traceExit('openInternal');
  }
  log.traceExit('open');
}

/**
 * Close, CloseSync - Close an opened object.
 *
 * @param {MQObject}
 *        jsObject - reference to the object (contains hConn and hObj)
 * @param {number}
 *        closeOptions
 * @param {function}
 *        callback - optional for sync variant. Invoked for errors. No additional parameters
 *        on success.
 * @throws {MQError}
 *         Container for MQRC and MQCC values
 * @throws {TypeError}
 *         When a parameter is of incorrect type
 */
exports.CloseSync = function (jsObject, jsCloseOptions, cb) {
  log.traceEntry('CloseSync');
  checkParamCB(cb);
  close(jsObject, jsCloseOptions, false, cb);
  log.traceExit('CloseSync');
};
exports.Close = function (jsObject, jsCloseOptions, cb) {
  log.traceEntry('Close');
  checkParamCBRequired(cb, true);
  close(jsObject, jsCloseOptions, true, cb);
  log.traceExit('Close');
};

function close(jsObject, jsCloseOptions, async, cb) {
  log.traceEntry('close');
  checkParamRequired(jsObject, MQObject, 'MQObject', false);
  checkParam(jsCloseOptions, 'number', 'number');
  checkParamArray(jsCloseOptions, 'number', 'number');

  closeInternal();

  function closeInternal() {
    var err;
    var jsRc = MQC.MQCC_OK;
    var jsCc = MQC.MQRC_NONE;
    log.traceEntry('closeInternal');
    if (!jsObject) {
      jsRc = MQC.MQRC_HOBJ_ERROR;
      jsCc = MQC.MQCC_FAILED;

      err = new MQError(jsCc, jsRc, "CLOSE");

      if (cb) {
        log.traceExitErr('closeInternal', err);
        return cb(err);
      } else {
        log.traceExitErr('closeInternal', err);
        throw err;
      }
    }

    // check if hConn is already being used
    if (isLocked(jsObject._mqQueueManager._hConn)) {
      log.traceExit('closeInternal', 'isLocked');
      return setImmediate(closeInternal);
    } else {
      lock(jsObject._mqQueueManager._hConn);
    }

    if (async) {
      mqnapi.Close(jsObject._mqQueueManager._hConn, jsObject._hObj, mqt.flagsToNumber('MQCO', jsCloseOptions), function (result) {
        unlock(jsObject._mqQueueManager._hConn);

        jsRc = result.jsRc;
        jsCc = result.jsCc;
        if (jsCc == MQC.MQCC_OK) {
          GetAsync.deleteUserContext(jsObject);
        }
        jsObject._hObj = result.jsHObj;

        err = new MQError(jsCc, jsRc, "CLOSE");

        if (jsCc != MQC.MQCC_OK) {
          cb(err);
        } else {
          cb(null);
        }
      });
    } else {
      var mqHObj = jsObject._hObj;
      var result = mqnapi.Close(jsObject._mqQueueManager._hConn, mqHObj, mqt.flagsToNumber('MQCO', jsCloseOptions));
      unlock(jsObject._mqQueueManager._hConn);

      jsRc = result.jsRc;
      jsCc = result.jsCc;
      if (jsCc == MQC.MQCC_OK) {
        GetAsync.deleteUserContext(jsObject);
      }
      jsObject._hObj = result.jsHObj;

      err = new MQError(jsCc, jsRc, "CLOSE");

      if (cb) {
        if (jsCc != MQC.MQCC_OK) {
          cb(err);
        } else {
          cb(null);
        }
      } else {
        if (jsCc != MQC.MQCC_OK) {
          log.traceExitErr('closeInternal', err);
          throw err;
        } else {
          log.traceExit('closeInternal');
          return;
        }
      }
    }
    log.traceExit('closeInternal');
  }
  log.traceExit('close');
}

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
exports.Begin = function (jsQueueManager, cb) {
  checkParamCB(cb);
  checkParam(jsQueueManager, MQQueueManager, 'MQQueueManager');

  log.traceEntry('Begin');

  // The MQBO structure can be set to NULL as there are no
  // real options defined at the moment.
  var result = mqnapi.Begin(jsQueueManager._hConn);

  var jsRc = result.jsRc;
  var jsCc = result.jsCc;
  var err = new MQError(jsCc, jsRc, "BEGIN");

  if (cb) {
    if (jsCc != MQC.MQCC_OK) {
      cb(err);
    } else {
      cb(null);
    }
  } else {
    if (jsCc != MQC.MQCC_OK) {
      log.traceExitErr('Begin', err);
      throw err;
    } else {
      log.traceExit('Begin');
      return;
    }
  }
  log.traceExit('Begin');
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
exports.Cmit = function (jsQueueManager, cb) {
  checkParamCB(cb);
  checkParam(jsQueueManager, MQQueueManager, 'MQQueueManager');

  log.traceEntry('Cmit');

  var result = mqnapi.Cmit(jsQueueManager._hConn);

  var jsRc = result.jsRc;
  var jsCc = result.jsCc;
  var err = new MQError(jsCc, jsRc, "CMIT");

  if (cb) {
    if (jsCc != MQC.MQCC_OK) {
      cb(err);
    } else {
      cb(null);
    }
  } else {
    if (jsCc != MQC.MQCC_OK) {
      log.traceExitErr('Cmit', err);
      throw err;
    } else {
      log.traceExit('Cmit');
      return;
    }
  }
  log.traceExit('Cmit');
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
exports.Back = function (jsQueueManager, cb) {

  log.traceEntry('Back');
  checkParamCB(cb);
  checkParam(jsQueueManager, MQQueueManager, 'MQQueueManager');

  var result = mqnapi.Back(jsQueueManager._hConn);

  var jsRc = result.jsRc;
  var jsCc = result.jsCc;
  var err = new MQError(jsCc, jsRc, "BACK");

  if (cb) {
    if (jsCc != MQC.MQCC_OK) {
      cb(err);
    } else {
      cb(null);
    }
  } else {
    if (jsCc != MQC.MQCC_OK) {
      log.traceExitErr('Back', err);
      throw err;
    } else {
      log.traceExit('Back');
      return;
    }
  }
  log.traceExit('Back');
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
 *        callback - Required. Invoked for errors. On success, given a
 *        reference to the opened subscription and the opened queue.
 * @throws {MQError}
 *         Container for MQRC and MQCC values
 * @throws {TypeError}
 *         When a parameter is of incorrect type
 */
exports.SubSync = function (jsQueueManager, jsQueueObject, jssd, cb) { //-> fill in Hobj if managed, Hsub describing subscription
  log.traceEntry('SubSync');
  checkParamCBRequired(cb, true);
  sub(jsQueueManager, jsQueueObject, jssd, false, cb);
  log.traceExit('SubSync');
};
exports.Sub = function (jsQueueManager, jsQueueObject, jssd, cb) { //-> fill in Hobj if managed, Hsub describing subscription
  log.traceEntry('Sub');
  checkParamCBRequired(cb, true);
  sub(jsQueueManager, jsQueueObject, jssd, true, cb);
  log.traceExit('Sub');
};

function sub(jsQueueManager, jsQueueObject, jssd, async, cb) {
  log.traceEntry('sub');
  checkParam(jsQueueManager, MQQueueManager, 'MQQueueManager');
  checkParamRequired(jsQueueObject, MQObject, 'MQObject', false);
  checkParam(jssd, MQSD.MQSD, 'MQSD');

  var jsHObjQ = MQC.MQHO_UNUSABLE_HOBJ;
  if (jsQueueObject) {
    jsHObjQ = jsQueueObject._jshObj;
  }

  subInternal();
  function subInternal() {
    log.traceEntry('subInternal');
    if (isLocked(jsQueueManager._hConn)) {
      log.traceExit('subInternal', 'isLocked');
      return setImmediate(subInternal);
    } else {
      lock(jsQueueManager._hConn);
    }
    if (async) {
      mqnapi.Sub(jsQueueManager._hConn,
        jssd,
        jsHObjQ,
        function (result) {
          unlock(jsQueueManager._hConn);

          var jsRc = result.jsRc;
          var jsCc = result.jsCc;
          jsHObjQ = result.jsHObjQ;
          var jsHObjSub = result.jsHObjSub;

          var err = new MQError(jsCc, jsRc, "SUB");

          var jsSubObject = new MQObject(jsHObjSub, jsQueueManager, jssd.ResObjectString);
          var jsPublicationQueueObject = jsQueueObject;
          if (!jsPublicationQueueObject) {
            jsPublicationQueueObject = new MQObject(jsHObjQ, jsQueueManager, 'ManagedQueue');
          }

          if (jsCc != MQC.MQCC_OK) {
            cb(err, jsPublicationQueueObject, jsSubObject);
          } else {
            cb(null, jsPublicationQueueObject, jsSubObject);
          }
        });
    } else {
      var result = mqnapi.Sub(jsQueueManager._hConn,
        jssd,
        jsHObjQ);
      unlock(jsQueueManager._hConn);

      var jsRc = result.jsRc;
      var jsCc = result.jsCc;
      jsHObjQ = result.jsHObjQ;
      var jsHObjSub = result.jsHObjSub;

      var err = new MQError(jsCc, jsRc, "SUB");

      var jsSubObject = new MQObject(jsHObjSub, jsQueueManager, jssd.ResObjectString);
      var jsPublicationQueueObject = jsQueueObject;
      if (!jsPublicationQueueObject) {
        jsPublicationQueueObject = new MQObject(jsHObjQ, jsQueueManager, 'ManagedQueue');
      }

      if (cb) {
        if (jsCc != MQC.MQCC_OK) {
          cb(err, jsPublicationQueueObject, jsSubObject);
        } else {
          cb(null, jsPublicationQueueObject, jsSubObject);
        }
      } else {
        if (jsCc != MQC.MQCC_OK) {
          log.traceExitErr('subInternal', err);
          throw err;
        } else {
          log.traceExit('subInternal');
          return;
        }
      }
    }
    log.traceExit('subInternal');
  }
  log.traceExit('sub');
}


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
exports.Subrq = function (jsQueueManager, jsSubObject, jsaction, jssro, cb) {
  log.traceEntry('Subrq');
  checkParamCB(cb);
  checkParam(jsQueueManager, MQQueueManager, 'MQQueueManager');
  checkParamRequired(jsSubObject, MQObject, 'MQObject', false);
  checkParam(jssro, MQSRO.MQSRO, 'MQSRO');
  checkParam(jsaction, 'number', 'number');

  var savedOptions = jssro.Options;
  jssro.Options = mqt.flagsToNumber('MQSRO', jssro.Options);

  var result = mqnapi.Subrq(jsQueueManager._hConn,
    jsSubObject._hObj,
    jsaction,
    jssro);

  var jsRc = result.rsRc;
  var jsCc = result.jsCc;
  jssro.Options = savedOptions; /* Make sure we pass them back in the same format as they came in */

  var err = new MQError(jsCc, jsRc, "SUBRQ");

  if (cb) {
    if (jsCc != MQC.MQCC_OK) {
      cb(err);
    } else {
      cb(null);
    }
  } else {
    if (jsCc != MQC.MQCC_OK) {
      log.traceExitErr('Subrq', err);
      throw err;
    } else {
      log.traceExit('Subrq');
      return;
    }
  }
  log.traceExit('Subrc');
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
exports.Stat = function (jsQueueManager, jsType, cb) {
  checkParamCB(cb);
  checkParam(jsQueueManager, MQQueueManager, 'MQQueueManager');
  checkParam(jsType, 'number', 'number');

  var jssts = new MQSTS.MQSTS();

  log.traceEntry('Stat');


  var result = mqnapi.Stat(jsQueueManager._hConn, jsType, jssts);

  var jsRc = result.jsRc;
  var jsCc = result.jsCc;

  var err = new MQError(jsCc, jsRc, "STAT");

  if (cb) {
    if (jsCc != MQC.MQCC_OK) {
      cb(err, jssts);
    } else {
      cb(null, jssts);
    }
  } else {
    if (jsCc != MQC.MQCC_OK) {
      log.traceExitErr('Stat', err);
      throw err;
    } else {
      log.traceExit('Stat');
      return jssts;
    }
  }
  log.traceExit('Stat');
};


/**
 * Put, PutSync -  Put a message to a queue or publish to a topic.
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
 *        callback - optional for Sync variant. Invoked for errors. No additional parameter
 *        on success.
 * @throws {MQError}
 *         Container for MQRC and MQCC values
 * @throws {TypeError}
 *         When a parameter is of incorrect type
 */
exports.PutSync = function (jsObject, jsmd, jspmo, buf, cb) {
  log.traceEntry('PutSync');
  checkParamCB(cb);
  put(jsObject, jsmd, jspmo, buf, false, cb);
  log.traceExit('PutSync');
};
exports.Put = function (jsObject, jsmd, jspmo, buf, cb) {
  log.traceEntry('Put');
  checkParamCBRequired(cb, true);
  put(jsObject, jsmd, jspmo, buf, true, cb);
  log.traceExit('Put');
};
function put(jsObject, jsmd, jspmo, buf, async, cb) {
  log.traceEntry('put');
  checkParam(jsObject, MQObject, 'MQObject');
  checkParam(jsmd, MQMD.MQMD, 'MQMD');
  checkParam(jspmo, MQPMO.MQPMO, 'MQPMO');

  if (buf) {
    if (typeof buf == "string") {
      buf = Buffer.from(buf);
      jsmd.Format = MQC.MQFMT_STRING;
    } else {
      checkParam(buf, Buffer, 'Buffer');
    }
  }

  putInternal();

  function putInternal() {
    log.traceEntry('putInternal');

    var mqmd = MQMD._newBuf();
    MQMD._copyMDtoBuf(jsmd, mqmd );
  
    var mqpmo = MQPMO._newBuf();
    MQPMO._copyPMOtoBuf(jspmo,mqpmo);

    if (isLocked(jsObject._mqQueueManager._hConn)) {
      log.traceExit('putInternal', 'isLocked');
      return setImmediate(putInternal);
    } else {
      lock(jsObject._mqQueueManager._hConn);
    }

    if (async) {
      mqnapi.Put(jsObject._mqQueueManager._hConn,
        jsObject._hObj,
        mqmd,
        mqpmo,
        buf, function (result) {
          unlock(jsObject._mqQueueManager._hConn);

          var jsRc = result.jsRc;
          var jsCc = result.jsCc;
          var err = new MQError(jsCc, jsRc, "PUT");

          MQMD._copyMDfromBuf(jsmd,mqmd);
          MQPMO._copyPMOfromBuf(jspmo,mqpmo);

          if (jsCc != MQC.MQCC_OK) {
            cb(err);
          } else {
            cb(null);
          }
        });
    } else {
      var result = mqnapi.Put(jsObject._mqQueueManager._hConn,
        jsObject._hObj,
        mqmd,
        mqpmo,
        buf);
      unlock(jsObject._mqQueueManager._hConn);

      var jsRc = result.jsRc;
      var jsCc = result.jsCc;
      var err = new MQError(jsCc, jsRc, "PUT");

      //jsmd.MsgFlags = mqt.flagsFromNumber('MQMF', savedMDMsgFlags, jsmd.MsgFlags);
      //jsmd.Report = mqt.flagsFromNumber('MQRO', savedMDReport, jsmd.Report);
      //jspmo.Options = mqt.flagsFromNumber('MQPMO', savedPMOOptions, jspmo.Options);

      MQMD._copyMDfromBuf(jsmd,mqmd);
      MQPMO._copyPMOfromBuf(jspmo,mqpmo);

      if (cb) {
        if (jsCc != MQC.MQCC_OK) {
          cb(err);
        } else {
          cb(null);
        }
      } else {
        if (jsCc != MQC.MQCC_OK) {
          log.traceExitErr('putInternal', err);
          throw err;
        } else {
          log.traceExit('putInternal');
          return;
        }
      }
    }
    log.traceExit('putInternal');
  }
  log.traceExit('put');
}


/**
 * Put1, Put1Sync -  Put a message to a queue or publish to a topic.
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
 *        callback - optional for sync variant. Invoked for errors. No additional parameter
 *        on success.
 * @throws {MQError}
 *         Container for MQRC and MQCC values
 * @throws {TypeError}
 *         When a parameter is of incorrect type
 */
exports.Put1Sync = function (jsQueueManager, jsod, jsmd, jspmo, buf, cb) {
  log.traceEntry('Put1Sync');
  checkParamCB(cb);
  put1(jsQueueManager, jsod, jsmd, jspmo, buf, false, cb);
  log.traceExit('Put1Sync');
};
exports.Put1 = function (jsQueueManager, jsod, jsmd, jspmo, buf, cb) {
  log.traceEntry('Put1');
  checkParamCBRequired(cb, true);
  put1(jsQueueManager, jsod, jsmd, jspmo, buf, true, cb);
  log.traceExit('Put1');
};

function put1(jsQueueManager, jsod, jsmd, jspmo, buf, async, cb) {
  log.traceEntry('put1');
  checkParam(jsQueueManager, MQQueueManager, 'MQQueueManager');
  checkParam(jsmd, MQMD.MQMD, 'MQMD');
  checkParam(jsod, MQOD.MQOD, 'MQOD');
  checkParam(jspmo, MQPMO.MQPMO, 'MQPMO');

  put1Internal();

  function put1Internal() {
    log.traceEntry('put1Internal');
    if (isLocked(jsQueueManager._hConn)) {
      log.traceExit('put1Internal', 'isLocked');
      return setImmediate(put1Internal);
    } else {
      lock(jsQueueManager._hConn);
    }

    var mqmd = MQMD._newBuf();
    MQMD._copyMDtoBuf(jsmd, mqmd );
  
    var mqpmo = MQPMO._newBuf();
    MQPMO._copyPMOtoBuf(jspmo,mqpmo);

    // If it's a string, then we need to create a Buffer from it.
    // We also set the MQMD Format
    // TODO: Are there any string codepage conversions we should look at here?
    if (buf) {
      if (typeof buf == "string") {
        buf = Buffer.from(buf);
        jsmd.Format = MQC.MQFMT_STRING;
      } else {
        checkParam(buf, Buffer, 'Buffer');
      }
    }

    if (async) {
      mqnapi.Put1(jsQueueManager._hConn,
        jsod,
        mqmd,
        mqpmo,
        buf,
        function (result) {
          unlock(jsQueueManager._hConn);

          MQMD._copyMDfromBuf(jsmd,mqmd);
          MQPMO._copyPMOfromBuf(jspmo,mqpmo);

          var jsRc = result.jsRc;
          var jsCc = result.jsCc;
          var err = new MQError(jsCc, jsRc, "PUT1");

          if (jsCc != MQC.MQCC_OK) {
            cb(err);
          } else {
            cb(null);
          }
        });
    } else {
      var result = mqnapi.Put1(jsQueueManager._hConn,
        jsod,
        mqmd,
        mqpmo,
        buf);
      unlock(jsQueueManager._hConn);

      //jsmd.MsgFlags = mqt.flagsFromNumber('MQMF', savedMDMsgFlags, jsmd.MsgFlags);
      //jsmd.Report = mqt.flagsFromNumber('MQRO', savedMDReport, jsmd.Report);
      //jspmo.Options = mqt.flagsFromNumber('MQPMO', savedPMOOptions, jspmo.Options);
      
      MQMD._copyMDfromBuf(jsmd,mqmd);
      MQPMO._copyPMOfromBuf(jspmo,mqpmo);

      var jsRc = result.jsRc;
      var jsCc = result.jsCc;
      var err = new MQError(jsCc, jsRc, "PUT1");

      if (cb) {
        if (jsCc != MQC.MQCC_OK) {
          cb(err);
        } else {
          cb(null);
        }
      } else {
        if (jsCc != MQC.MQCC_OK) {
          log.traceExitErr('put1Internal', err);
          throw err;
        } else {
          log.traceExit('put1Internal');
          return;
        }
      }
    }
    log.traceExit('put1Internal');
  }
  log.traceExit('put1');
}

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
exports.GetSync = function (jsObject, jsmd, jsgmo, buf, cb) {
  log.traceEntry('GetSync');
  checkParamCB(cb);
  checkParam(jsObject, MQObject, 'MQObject');
  checkParam(jsmd, MQMD.MQMD, 'MQMD');
  checkParam(jsgmo, MQGMO.MQGMO, 'MQGMO');
  checkParam(buf, Buffer, 'Buffer');

  //var savedOptions = jsgmo.Options;
  //var savedMatchOptions = jsgmo.MatchOptions;

  //jsgmo.Options = mqt.flagsToNumber('MQGMO', jsgmo.Options);
  //jsgmo.MatchOptions = mqt.flagsToNumber('MQGMO', jsgmo.MatchOptions);
  var mqmd = MQMD._newBuf();
  MQMD._copyMDtoBuf(jsmd, mqmd );

  var mqgmo = MQGMO._newBuf();
  MQGMO._copyGMOtoBuf(jsgmo,mqgmo);

  var result = mqnapi.Get(jsObject._mqQueueManager._hConn,
    jsObject._hObj,
    mqmd,
    mqgmo,
    buf);

  var jsRc = result.jsRc;
  var jsCc = result.jsCc;
  var jsDatalen = result.jsDatalen;
  var err = new MQError(jsCc, jsRc, "GET");

  //jsgmo.Options = mqt.flagsFromNumber('MQGMO', savedOptions, jsgmo.Options);
  //jsgmo.MatchOptions = mqt.flagsFromNumber('MQMO', savedMatchOptions, jsgmo.MatchOptions);
  MQMD._copyMDfromBuf(jsmd,mqmd);
  MQGMO._copyGMOfromBuf(jsgmo,mqgmo);

  log.debug("Returned MD is %o",jsmd)    ;
  //log.debug("Returned GMO is %o",jsgmo)    ;

  if (cb) {
    if (jsCc != MQC.MQCC_OK) {
      cb(err, jsDatalen);
    } else {
      cb(null, jsDatalen);
    }
  } else {
    if (jsCc != MQC.MQCC_OK) {
      log.traceExitErr('GetSync', err);
      throw err;
    } else {
      log.traceExit('GetSync', "datalen: %d", jsDatalen);
      return jsDatalen;
    }
  }
  log.traceExit('GetSync', "datalen: %d", jsDatalen);
};

/**
 * Get -  Get a message from a queue asynchronously. Use GetDone()
 * to clear the callback. No data buffer needs to be supplied as input to
 * this function, but message data and the MQMD should be processed or copied
 * before returning from your callback.
 *
 * In particular, Buffer datatypes need to be fully copied if you need the
 * contents later, do not just save a reference to them. For example, do
 *  'savedMsgId = Buffer.from(jsmd.MsgId)', not 'savedMsgId = jsmd.MsgId'
 *
 * Note that calling another asynchronous operation within your callback
 * is likely to cause the callback to end before that operation is scheduled.
 * And then the MQMD or data buffer may get overwritten
 * by a subsequent message so that async operation may not see the expected data.
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
 *          (error, MQObject, MQGMO, MQMD, data, MQQueueManager)
 * @throws {MQError}
 *         Container for MQRC and MQCC values
 * @throws {TypeError}
 *         When a parameter is of incorrect type
 */
exports.Get = function (jsObject, jsmd, jsgmo, cb) {
  // The callback is not optional here - must be provided.
  mqt.checkParamCBRequired(cb, true);
  mqt.checkParam(jsObject, MQObject, 'MQObject');
  mqt.checkParam(jsmd, MQMD.MQMD, 'MQMD');
  mqt.checkParam(jsgmo, MQGMO.MQGMO, 'MQGMO');

  // The real work is in a separate file. But we have now checked the 
  // parameters.
  GetAsync.GetAsync(jsObject, jsmd, jsgmo, cb);
};

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
exports.Inq = function (jsObject, jsSelectors, cb) {
  checkParamCB(cb);
  checkParam(jsObject, MQObject, 'MQObject', true);
  checkArray(jsSelectors);

  var jsRc = MQC.MQRC_NONE;
  var jsCc = MQC.MQCC_OK;
  var i;
  var charAttrLen = 0;
  var charLen;
  var badSelector = false;
  var selector;

  log.traceEntry('Inq');

  for (i = 0; i < jsSelectors.length; i++) {
    var nameCount = 0;
    selector = jsSelectors[i].selector;
    checkParam(jsSelectors[i], exports.MQAttr, 'MQAttr', true);
    if (selector >= MQC.MQCA_FIRST && selector <= MQC.MQCA_LAST) {
      if (selector == MQC.MQIA_NAME_COUNT) {
        nameCount = jsSelectors[i].value;
      }
      charLen = mqcaLen(selector, nameCount);
      if (charLen < 0) {
        jsCc = MQC.MQCC_FAILED;
        jsRc = MQC.MQRC_SELECTOR_ERROR;
      } else {
        jsSelectors[i]._length = charLen;
      }
    }
  }

  if (jsCc == MQC.MQCC_OK) {
    var result = mqnapi.Inq(jsObject._mqQueueManager._hConn, jsObject._hObj, jsSelectors);
    jsRc = result.jsRc;
    jsCc = result.jsCc;
  }
  var err = new MQError(jsCc, jsRc, "INQ");

  if (cb) {
    if (jsCc != MQC.MQCC_OK) {
      cb(err, jsSelectors);
    } else {
      cb(null, jsSelectors);
    }
  } else {
    if (jsCc != MQC.MQCC_OK) {
      log.traceExitErr('Inq', err);
      throw err;
    } else {
      log.traceExit('Inq');
      return;
    }
  }
  log.traceExit('Inq');
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
exports.Set = function (jsObject, jsSelectors, cb) {
  log.traceEntry('Set');

  checkParamCB(cb);
  checkParam(jsObject, MQObject, 'MQObject', true);
  checkArray(jsSelectors);

  var jsCc;
  var jsRc;
  var i;
  var badSelector = false;
  var charAttrLen = 0;

  for (i = 0; i < jsSelectors.length; i++) {
    checkParam(jsSelectors[i], exports.MQAttr, 'MQAttr', true);
    var selector = jsSelectors[i].selector;
    if (selector >= MQC.MQIA_FIRST && selector <= MQC.MQIA_LAST) {
      // do nothing
    } else if (selector >= MQC.MQCA_FIRST && selector <= MQC.MQCA_LAST) {
      var charLen = mqcaLen(selector);
      if (charLen > 0) {
        jsSelectors[i]._length = charLen;
        checkParam(jsSelectors[i], exports.MQAttr, 'string', true);
        if (jsSelectors[i].value.length > charLen) {
          badSelector = true;
        } else {
          charAttrLen += charLen;
        }
      } else {
        badSelector = true;
      }
    } else {
      badSelector = true;
    }
  }

  if (!badSelector) {
    var result = mqnapi.Set(jsObject._mqQueueManager._hConn, jsObject._hObj, jsSelectors, charAttrLen);
    jsRc = result.jsRc;
    jsCc = result.jsCc;
  } else {
    jsRc = MQC.MQRC_SELECTOR_ERROR;
    jsCc = MQC.MQCC_FAILED;
  }

  var err = new MQError(jsCc, jsRc, "SET");

  if (cb) {
    if (jsCc != MQC.MQCC_OK) {
      cb(err);
    } else {
      cb(null);
    }
  } else {
    if (jsCc != MQC.MQCC_OK) {
      log.traceExitErr('Set', err);
      throw err;
    } else {
      log.traceExit('Set');
      return;
    }
  }
  log.traceExit('Set');
};

/*
 * This function knows about all of the character attributes that
 * may be used in MQSET/MQINQ so that it can return the length
 * of the appropriate string. The nameCount variable is usually
 * undefined/unused; it only has to be set when looking at a namelist.
 */
function mqcaLen(s, nameCount) {
  log.traceEntry('mqcaLen', "attr:%d", s);
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
    case MQC.MQCA_CERT_LABEL:
    case MQC.MQCA_QSG_CERT_LABEL:
      rc = MQC.MQ_CERT_LABEL_LENGTH;
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
    case MQC.MQCA_CLUS_CHL_NAME:
      rc = MQC.MQ_OBJECT_NAME_LENGTH;
      break;
    case MQC.MQCA_CLUSTER_WORKLOAD_DATA:
      rc = MQC.MQ_EXIT_DATA_LENGTH;
      break;
    case MQC.MQCA_COMM_INFO_NAME:
      rc = MQC.MQ_OBJECT_NAME_LENGTH;
      break;
    case MQC.MQCA_CONN_AUTH:
      rc = MQC.MQ_AUTH_INFO_NAME_LENGTH;
      break;
    case MQC.MQCA_CUSTOM:
      rc = MQC.MQ_CUSTOM_LENGTH;
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
    case MQC.MQCA_INITIAL_KEY:
      rc = MQC.MQ_INITIAL_KEY_LENGTH;
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
    case MQC.MQCA_SSL_CRL_NAMELIST:
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
      rc = MQC.MQ_Q_DESC_LENGTH;
      break;
    case MQC.MQCA_Q_MGR_DESC:
      rc = MQC.MQ_Q_MGR_DESC_LENGTH;
      break;
    case MQC.MQCA_Q_MGR_IDENTIFIER:
      rc = MQC.MQ_Q_MGR_IDENTIFIER_LENGTH;
      break;
    case MQC.MQCA_QSG_NAME:
      rc = MQC.MQ_QSG_NAME_LENGTH;
      break;
    case MQC.MQCA_SSL_CRYPTO_HARDWARE:
      rc = MQC.SSL_CRYPRO_HARDWARE_LENGTH;
      break;
    case MQC.MQCA_SSL_KEY_REPOSITORY:
      rc = MQC.MQ_SSL_KEY_REPOSITORY_LENGTH;
      break;
    case MQC.MQCA_SSL_KEY_REPO_PASSWORD:
      rc = MQC.MQ_SSL_ENCRYP_KEY_REPO_PWD_LEN;
      break;
    case MQC.MQCA_STORAGE_CLASS:
      rc = MQC.MQ_STORAGE_CLASS_LENGTH;
      break;
    case MQC.MQCA_STREAM_QUEUE_NAME:
      rc = MQC.MQ_Q_NAME_LENGTH;
      break;
    case MQC.MQCA_TCP_NAME:
      rc = MQC.MQ_TCP_NAME_LENGTH;
      break;
    case MQC.MQCA_USER_DATA:
      rc = MQC.MQ_PROCESS_USER_DATA_LENGTH;
      break;
    case MQC.MQCA_VERSION:
      rc = MQC.MQ_VERSION_LENGTH;
      break;

    default:
      rc = -1;
      break;
  }
  log.traceExit('mqcaLen', "len:%d", rc);
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
exports.CrtMh = function (jsQueueManager, jscmho, cb) {
  log.traceEntry('CrtMh');

  checkParamCB(cb);
  checkParam(jsQueueManager, MQQueueManager, 'MQQueueManager');
  checkParam(jscmho, MQMHO.MQCMHO, 'MQCMHO');

  var savedOptions = jscmho.Options;
  jscmho.Options = mqt.flagsToNumber('MQCMHO', jscmho.Options);

  var result = mqnapi.CrtMh(jsQueueManager._hConn, jscmho);

  jscmho.Options = savedOptions; // They are unchanged
  var jsRc = result.jsRc;
  var jsCc = result.jsCc;
  var jsHMsg = result.jsHMsg;

  var err = new MQError(jsCc, jsRc, "MQCRTMH");
  log.debug("Return from crtmh is %o", result);
  if (cb) {
    if (jsCc != MQC.MQCC_OK) {
      cb(err);
    } else {
      cb(null, jsHMsg);
    }
  } else {
    if (jsCc != MQC.MQCC_OK) {
      log.traceExitErr('CrtMh', err);
      throw err;
    } else {
      log.traceExit('CrtMh');
      return jsHMsg;
    }
  }
  log.traceExit('CrtMh');
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
exports.DltMh = function (jsQueueManager, jsHMsg, jsdmho, cb) {
  log.traceEntry('Dltmh');

  checkParamCB(cb);
  checkParam(jsQueueManager, MQQueueManager, 'MQQueueManager');
  checkParam(jsdmho, MQMHO.MQDMHO, 'MQDMHO');

  var savedOptions = jsdmho.Options;

  jsdmho.Options = mqt.flagsToNumber('MQDMHO', jsdmho.Options);

  var result = mqnapi.DltMh(jsQueueManager._hConn, jsHMsg, jsdmho);

  jsdmho.Options = savedOptions; // They are unchanged
  var jsRc = result.jsRc;
  var jsCc = result.jsCc;

  var err = new MQError(jsCc, jsRc, "MQDLTMH");

  if (cb) {
    if (jsCc != MQC.MQCC_OK) {
      cb(err);
    } else {
      cb(null);
    }
  } else {
    if (jsCc != MQC.MQCC_OK) {
      log.traceExitErr('DltMh', err);
      throw err;
    } else {
      log.traceExit('DltMh');
      return;
    }
  }
  log.traceExit('DltMh');
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
exports.SetMp = function (jsQueueManager, jsHMsg, jssmpo, jsName, jspd, value, cb) {
  log.traceEntry('SetMp');

  checkParamCB(cb);
  checkParam(jsQueueManager, MQQueueManager, 'MQQueueManager');
  checkParam(jssmpo, MQMPO.MQSMPO, 'MQSMPO');
  checkParam(jspd, MQMPO.MQPD, 'MQPD');
  checkParam(jsName, 'string', 'string');

  var err;
  var savedOptions = jssmpo.Options;
  jssmpo.Options = mqt.flagsToNumber('MQSMPO', jssmpo.Options);

  var savedPDOptions = jspd.Options;
  var savedPDCopyOptions = jspd.CopyOptions;

  jspd.Options = mqt.flagsToNumber('MQPD_OPTIONS', jspd.Options);
  jspd.CopyOptions = mqt.flagsToNumber('MQCOPY', jspd.CopyOptions);

  var result = mqnapi.SetMp(jsQueueManager._hConn, jsHMsg, jssmpo, jsName, jspd, value);

  jssmpo.Options = savedOptions;
  jspd.Options = savedPDOptions;
  jspd.CopyOptions = savedPDCopyOptions;

  var jsRc = result.jsRc;
  var jsCc = result.jsCc;

  err = new MQError(jsCc, jsRc, "MQSETMP");

  if (cb) {
    if (jsCc != MQC.MQCC_OK) {
      cb(err);
    } else {
      cb(null);
    }
  } else {
    if (jsCc != MQC.MQCC_OK) {
      log.traceExitErr('SetMp', err);
      throw err;
    } else {
      log.traceExit('SetMp');
      return;
    }
  }
  log.traceExit('SetMp');
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
exports.InqMp = function (jsQueueManager, jsHMsg, jsimpo, jspd, jsName, valueBuffer, cb) {
  log.traceEntry('InqMp');

  checkParamCBRequired(cb, true);
  checkParam(jsQueueManager, MQQueueManager, 'MQQueueManager');
  checkParam(jsimpo, MQMPO.MQIMPO, 'MQIMPO');
  checkParam(jspd, MQMPO.MQPD, 'MQPD');
  checkParam(jsName, 'string', 'string');

  var savedOptions = jsimpo.Options;
  jsimpo.Options = mqt.flagsToNumber('MQIMPO', jsimpo.Options);

  var savedPDOptions = jspd.Options;
  var savedPDCopyOptions = jspd.CopyOptions;
  jspd.Options = mqt.flagsToNumber('MQPD_OPTIONS', jspd.Options);
  jspd.CopyOptions = mqt.flagsToNumber('MQCOPY', jspd.CopyOptions);

  // Set up the space for where we will return the property value. Normally
  // this should be set by the calling application as a Buffer but we will
  // try a locally-defined buffer if it's empty.
  var value;
  var valuePtr;
  if (valueBuffer) {
    valuePtr = valueBuffer;
  } else {
    valuePtr = Buffer.alloc(1024);
  }

  //log.debug("BEFORE - hmsg:%o impo:%o name:%s pd:%o valuePtr:%o",jsHMsg,jsimpo,jsName,jspd,valuePtr);

  var result = mqnapi.InqMp(jsQueueManager._hConn, jsHMsg, jsimpo,
    jsName, jspd, valuePtr);

  log.debug("AFTER - hmsg:%o impo:%o name:%s pd:%o result:%o valuePtr:%o", jsHMsg, jsimpo, jsName, jspd, result, valuePtr);

  jsimpo.Options = savedOptions;
  jspd.Options = savedPDOptions;
  jspd.CopyOptions = savedPDCopyOptions;

  var jsRc = result.jsRc;
  var jsCc = result.jsCc;

  var jsType = result.Type;
  var jsPropsLen = result.PropsLen;
  var returnedName = jsimpo.ReturnedName;
  if (jsCc == MQC.MQCC_OK) {

    var enc = jsimpo.ReturnedEncoding;
    var le = ((enc & MQC.MQENC_INTEGER_MASK) == MQC.MQENC_INTEGER_REVERSED);
    switch (jsType) {
      case MQC.MQTYPE_NULL:
        result.value = null;
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
        value = valuePtr.toString('utf8', 0, jsPropsLen);
        break;
      case MQC.MQTYPE_BOOLEAN:
        if (le) {
          value = valuePtr.readInt32LE(0) != 0;
        } else {
          value = valuePtr.readInt32BE(0) != 0;
        }
        break;
      case MQC.MQTYPE_BYTE_STRING:
        value = valuePtr;
        break;
      default:
        log.debug("Unknown property type %d", jsType);
        value = valuePtr;
        break;
    }
  }
  var err = new MQError(jsCc, jsRc, "MQINQMP");

  if (cb) {
    if (jsCc != MQC.MQCC_OK) {
      cb(err);
    } else {
      cb(null, returnedName, value, jsPropsLen, jsType);
    }
  } else {
    if (jsCc != MQC.MQCC_OK) {
      log.traceExitErr('InqMp', err);
      throw err;
    } else {
      log.traceExit('InqMp');
      return value;
    }
  }
  log.traceExit('InqMp');
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
exports.DltMp = function (jsQueueManager, jsHMsg, jsDmpo, jsName, cb) {
  log.traceEntry('DltMp');

  checkParamCB(cb);
  checkParam(jsQueueManager, MQQueueManager, 'MQQueueManager');
  checkParam(jsDmpo, MQMPO.MQDMPO, 'MQDMPO');
  checkParam(jsName, 'string', 'string');

  var savedOptions = jsDmpo.options;
  jsDmpo.Options = mqt.flagsToNumber('MQDMPO', jsDmpo.Options);

  var result = mqnapi.DltMp(jsQueueManager._hConn, jsHMsg, jsDmpo, jsName);

  jsDmpo.options = savedOptions;

  var jsRc = result.jsRc;
  var jsCc = result.jsCc;

  var err = new MQError(jsCc, jsRc, "MQDLTMP");

  if (cb) {
    if (jsCc != MQC.MQCC_OK) {
      cb(err);
    } else {
      cb(null);
    }
  } else {
    if (jsCc != MQC.MQCC_OK) {
      log.traceExitErr('DltMp', err);
      throw err;
    } else {
      log.traceExit('DltMp');
      return;
    }
  }
  log.traceExit('DltMp');
};

/*
 * Something to let me drive tests in the C++ layer
 */
exports._TestSP = function(...args) {
  mqnapi._TestSP(...args);
};

/*
*  Wrap the main MQI verbs so they can be used as promises instead
*  of using async callbacks. Most of the verbs in here follow a pattern
*  that can be automatically processed by util.promisify.
*/
exports.ConnPromise = util.promisify(exports.Conn);
exports.ConnxPromise = util.promisify(exports.Connx);
exports.DiscPromise = util.promisify(exports.Disc);
exports.OpenPromise = util.promisify(exports.Open);
exports.ClosePromise = util.promisify(exports.Close);
exports.PutPromise = util.promisify(exports.Put);
exports.Put1Promise = util.promisify(exports.Put1);

// The Sub verb needs to return 2 values in the successful case, which are passed in a
// single object as "resolve" only allows a single parameter
exports.SubPromise = (...args) => {
  return new Promise((resolve, reject) => {
    exports.Sub(...args, (err, hObj, hSub) => {
      if (err) return reject(err);
      resolve({ hObj, hSub });
    });
  });
};

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
*/

/*
 * This module implements a pseudo-asynchronous MQGET as a series of polling loops.
 * It does this because the true async-MQI operation (MQCB/MQCTL) has a thread model
 * that's incompatible with NodeJS.
 * 
 * I'm keeping this in a separate file to the rest of the MQI in the hope that I might
 * be able to replace it one day
 */

const path = require('path');
const util = require('util');

const mqnapi = require('node-gyp-build')(path.join(__dirname, '..'));

const MQC = require('./mqidefs.js');
const MQGMO = require('./mqgmo.js');
const MQMD = require('./mqmd.js');

const mqt = require('./mqitypes.js');
const MQError = mqt.MQError;
const log = require('./mqilogger.js');

/* After completing a cycle of message retrieval where some messages have
 * been read, how soon should we try again. Increasing this delay may be necessary 
 * if other work is starved of CPU in a very busy messaging environment. This is passed
 * to the C++ layer for its callback strategy
 */
const getLoopDelayTimeMsDefault = 250; //getLoopPollTimeMsMin;

/* How many messages to retrieve from an individual queue before delaying
 * This is passed to the C++ layer for its callback strategy
 */
const maxConsecutiveGetsDefault = 100;

/* Should debug logging be enabled
 */
const debugLogDefault = false;
const traceLogDefault = false;

const debugLongCallsDefault = false;
var debugLongCallsTimer = null;
const callbackStrategyDefault = "SYNCED";
const useCtlDefault = true;

/* The values set into a single object to simplify application tuning and
 * compatibility. The important tuning parameters are for this async get
 * implementation, so it sits in this file even though some are for global
 * logging.
 *
 * Most people should never need to touch these, and there is not a huge
 * amount of explanation on how they work!
 */
var tuningParameters = {
  maxConsecutiveGets: maxConsecutiveGetsDefault,
  getLoopDelayTimeMs: getLoopDelayTimeMsDefault,
  callbackStrategy: callbackStrategyDefault,
  useCtl: process.env['MQIJS_NOUSECTL']?false:useCtlDefault,
  debugLongCalls: debugLongCallsDefault,
  debugLog: debugLogDefault,
  traceLog: traceLogDefault
};

/**
 * setTuningParameters - Override values used to tune behaviour
 * <p>These properties affect the "fairness" heuristics that manage the
 * scheduling of message retrieval in a high-workload system.
 * @param {Object}
 *        parms - Object containing fields for the parameter values to override
 * @property {number} getLoopDelayTimeMs - Milliseconds to delay on a connection to give other connections
 *        a chance to catch up.
 * Default is 250 (1/4 second)
 * @property {number} maxConsecutiveGets - How many messages to get from a queue before delaying on the connection.
 * Default is 100
 * @property {string} callbackStrategy - SYNCED or READAHEAD as options to the C++ layer
 * Default is SYNCED
 * @property {boolean} debugLog - Turn on debug logging dynamically.
 * Default is false
 * @throws {TypeError}
 *         When the parameter or its properties is of incorrect type
 * @example
 * console.log("Tuning parms are %j",mq.getTuningParameters());
 * mq.setTuningParameters({maxConsecutiveGets:20});
 * console.log("Tuning parms are now %j",mq.getTuningParameters());
 */
exports.setTuningParameters = function (v) {
  log.traceEntry('setTuningParameters');
  mqt.checkParam(v, Object, 'Object', false);
  for (var key in v) {
    if (tuningParameters.hasOwnProperty(key)) {
      if (typeof tuningParameters[key] === 'boolean') {
        mqt.checkParam(v[key], 'boolean', 'boolean', true);
      } else if (typeof tuningParameters[key] === 'string') {
        mqt.checkParam(v[key], 'string', 'string', true);
      } else {
        mqt.checkParam(v[key], 'number', 'number', true);
      }
      tuningParameters[key] = v[key];

      // Reset some internal values if they have been modified by this call
      if (tuningParameters['debugLongCalls']) {
        // If enabled, run a monitor every second to check for long-running/stalled operations
        if (debugLongCallsTimer == null) {
          debugLongCallsTimer = setInterval(debugLongCallMonitorFunction, 1000);
        }
      } else {
        if (debugLongCallsTimer != null) {
          clearInterval(debugLongCallsTimer);
          debugLongCallsTimer = null;
        }
      }

      // Always reset the logging options to current versions
      log.traceEnabled = tuningParameters.traceLog || (process.env['MQIJS_TRACE'] != null);
      log.debugEnabled = tuningParameters.debugLog || (process.env['MQIJS_DEBUG'] != null) || log.traceEnabled;
    } else {
      var err = new TypeError('Unknown property : ' + key);
      log.traceExitErr('setTuningParameters', err);
      throw err;
    }
  }

  // Push tuning parms into the N-API layer too
  mqnapi._SetTuningParameters(tuningParameters);

  log.debug(util.format("Tuning Parameters are now %j ", tuningParameters));
  log.traceExit('setTuningParameters');

};

/**
 * getTuningParameters
 * @return Object containing the current values
 */
exports.getTuningParameters = function () {
  return tuningParameters;
};

/* This can be enabled by setting tuningParameter debugLongCalls to true
*/
function debugLongCallMonitorFunction() {
  log.trace('debugLongCalls', null, "HConn Count:%d", hConnsInUse.size);
  if (hConnsInUse.size > 0) {
    // iterate through all hConns
    for (let key of hConnsInUse.keys()) {
      let startTime = hConnsInUse.get(key);
      let elapsedTime = (Date.now() - startTime); // elapsed time in millisecs

      // If it is more than a second, this means something might have gone wrong.
      if (elapsedTime >= 1000) {
        log.debug('Error: Long-running operation found. Removing %j from the map', key);
        hConnsInUse.delete(key);
      }
    }
  }
}

/* These locks ensure that we don't try to issue two verbs at the same time for
 * an hConn. Even with the HANDLE_BLOCK in the connect options, it's too easy to 
 * get into an unexpected state with all the async processing going on.
 */
var hConnsInUse = new Map();

function isLocked(hc) {
  var rc = false;
  if (hConnsInUse.has(hc)) {
    rc = true;
  }
  return rc;
}

function lock(hc) {
  hConnsInUse.set(hc, Date.now());
}

function unlock(hc) {
  hConnsInUse.delete(hc);
}
exports.isLocked = isLocked;
exports.lock = lock;
exports.unlock = unlock;

function deleteUserContext(jsObject) { }
function deleteUserConnection(hConn) { }
exports.deleteUserContext = deleteUserContext;
exports.deleteUserConnection = deleteUserConnection;

/*********************************************************************
 * Functions to deal with async get. Start with the exported function
 * that the application calls.
 * 
 * We don't need to check the parameters in this function, as that has
 * already been done in the main entrypoint.
 */
exports.GetAsync = function (jsObject, jsmd, jsgmo, appCB) {
  log.traceEntry('GetAsync');

  //mqt.checkParamCBRequired(appCB, true);
  //mqt.checkParam(jsObject, mqt.MQObject, 'MQObject');
  //mqt.checkParam(jsmd, MQMD.MQMD, 'MQMD');
  //mqt.checkParam(jsgmo, MQGMO.MQGMO, 'MQGMO');

  const useCtl = tuningParameters.useCtl;

  log.debug("UseCtl = ",useCtl);
  var mqmd = MQMD._newBuf();
  MQMD._copyMDtoBuf(jsmd, mqmd);

  var mqgmo = MQGMO._newBuf();
  MQGMO._copyGMOtoBuf(jsgmo, mqgmo);

  const result = mqnapi.GetAsync(jsObject._mqQueueManager._hConn,
    jsObject._hObj,
    jsObject,
    mqmd,
    mqgmo,
    useCtl,
    preJsAppCB,
    appCB);

  const jsRc = result.jsRc;
  const jsCc = result.jsCc;

  // If there's a problem setting up the callbacks, then 
  // report it immediately. Otherwise, simply return - the CB 
  // will get called on message arrival.
  if (jsCc != MQC.MQCC_OK) {
    const err = new MQError(jsCc, jsRc, "GET[async]");
    appCB(err, 0);
  }

  log.traceExit('GetAsync');
};

function preJsAppCB(o, buf) {
  const jsCc = o.jsCc;
  const jsRc = o.jsRc;
  const hObj = o.jsHObj;
  var s = 0;

  var hConn;
  if (hObj) {
    hConn = o.jsHObj.hConn;
  }

  var jsmd = new MQMD.MQMD();
  var jsgmo = new MQGMO.MQGMO();
  var err;

  //log.debug("Start of JsAppCB with buf len = ",buf?buf.length:0);

  if (jsCc != MQC.MQCC_OK) {
    err = new MQError(jsCc, jsRc, "GET[async]");
  } else {
    if (buf) {
      MQGMO._copyGMOfromBuf(jsgmo, buf.subarray(s,MQC.MQGMO_LENGTH_4));
      s += MQC.MQGMO_LENGTH_4;
      MQMD._copyMDfromBuf(jsmd,buf.subarray(s, s + MQC.MQMD_LENGTH_2));
      s += MQC.MQMD_LENGTH_2;
    }
  }

  const appCB = o.appCB;
  if (appCB) { 
    log.debug("Pre AppCB");
    appCB(err, hObj, jsgmo,jsmd,buf?buf.subarray(s):null, hConn );
    log.debug("Post AppCB");
  } else {
    log.debug("AppCB is null");
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
exports.GetDone = function (jsObject, cb) {

  log.traceEntry('GetDone');
  mqt.checkParamRequired(jsObject, mqt.MQObject, 'MQObject', false);

  var result = mqnapi.GetDone(jsObject._mqQueueManager._hConn,
    jsObject._hObj);
  var jsRc = result.jsRc;
  var jsCc = result.jsCc;
  var err;
  
  if (jsCc != MQC.MQCC_OK) {
    err = new MQError(jsCc, jsRc, "GETDONE");
  }  

  if (cb) {
    cb(err);
  } else {
    if (err) {
      log.traceExitErr('GetDone', err);
      throw err;
    } else {
      log.traceExit('GetDone');
      return;
    }
  }
  log.traceExit('GetDone');
};

/**
 * Ctl -  Start/Suspend/Resume Get processing for all listeners on this queue manager
 *
 * @param {MQQueueManager}
 *        jsObject - reference to the opened object (hConn and hObj)
 * @param {number}
 *        operation - One of the valid MQOP_* values 
 * @param {function}
 *        callback - Invoked for errors.
 * @throws {MQError}
 *         Container for MQRC and MQCC values
 * @throws {TypeError}
 *         When a parameter is of incorrect type
 */
exports.Ctl = function (jsQueueManager, operation, cb) {

  log.traceEntry('Ctl');
  mqt.checkParamRequired(jsQueueManager, mqt.MQQueueManager, 'MQQueueManager', true);
  mqt.checkParamRequired(operation, 'number', 'number',true);

  var result = mqnapi.Ctl(jsQueueManager._hConn,operation);
  var jsRc = result.jsRc;
  var jsCc = result.jsCc;
  var err;
  
  if (jsCc != MQC.MQCC_OK) {
    err = new MQError(jsCc, jsRc, "Ctl");
  }  

  if (cb) {
    cb(err);
  } else {
    if (err) {
      log.traceExitErr('Ctl', err);
      throw err;
    } else {
      log.traceExit('Ctl');
      return;
    }
  }
  log.traceExit('Ctl');
};

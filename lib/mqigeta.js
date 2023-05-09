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

const util = require('util');

const mqnapi = require('../build/Release/ibmmq_native');
const MQC = require('./mqidefs.js');
const MQGMO = require('./mqgmo.js');
const MQMD = require('./mqmd.js');

const mqt = require('./mqitypes.js');
const MQError = mqt.MQError;
const log = require('./mqilogger.js');

/* Define the interval at which the MQGET loop for emulating async
 * retrieval is executed.
 */
const getLoopPollTimeMsMin = 0;
const getLoopPollTimeMsDefault = 10 * 1000; // Default to 10 seconds

/* After completing a cycle of message retrieval where some messages have
 * been read, how soon should we
 * try again. Increasing this delay may be necessary if other work is
 * starved of CPU in a very busy messaging environment.
 */
const getLoopDelayTimeMsDefault = 250; //getLoopPollTimeMsMin;

/* How many messages to retrieve from an individual queue before moving to
 * try to get from a different queue in the set
 */
const maxConsecutiveGetsDefault = 100;

/* Should debug logging be enabled
 */
const debugLogDefault = false;
const traceLogDefault = false;

const debugLongCallsDefault = false;
var debugLongCallsTimer = null;

// Maximum message length is 100MB
const maxBufSize = 100 * 1024 * 1024;
const defaultBufSize = 10240;

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
  getLoopPollTimeMs: getLoopPollTimeMsDefault,
  getLoopDelayTimeMs: getLoopDelayTimeMsDefault,
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
 * @property {number} getLoopPollTimeMs - Milliseconds between each full poll cycle.
 * Default is 10000 (10 seconds)
 * @property {number} getLoopDelayTimeMs - Milliseconds to delay after a partial poll cycle.
 * Default is 250 (1/4 second)
 * @property {number} maxConsecutiveGets - How many messages to get from a queue before trying a different queue.
 * Default is 100
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

// A set of functions to deal with storing state across
// MQGET callbacks.
var contextMap = new Map();
function UserContext(o, cb) {
  this.cb = cb;
  this.object = o;
  this.WaitInterval = 0;
  this.WaitStartTime = Date.now();
  this.jsgmo = null;
  this.jsmd = null;
  this.buf = null;
  this.bufSize = defaultBufSize; // Use a 10K buffer by default
  this.state = 'running'; // state management
  this.retrieved = 0;
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

function setUserContext(jsObject, cb, callbackArea) {
  log.traceEntry('setUserContext');
  var c = new UserContext(jsObject, cb, callbackArea);
  var key = getKey(jsObject);
  if (key) {
    contextMap.set(key, c);
  }
  log.traceExit('setUserContext');
  return c;
}

function getUserContext(jsObject) {
  log.traceEntry('getUserContext');
  if (jsObject) {
    var key = getKey(jsObject);
    if (key) {
      var m = contextMap.get(key);
      log.traceExit('getUserContext', 'key: %s context: %s', key, (m != null) ? "found" : "not found");
      return m;
    }
  }
  log.traceExit('getUserContext');
  return null;
}

function deleteUserContext(jsObject) {
  var key = getKey(jsObject);
  log.traceEntry('deleteUserContext', "key: %s", key ? key : "null");

  if (key) {
    contextMap.delete(key);
  }
  log.traceExit('deleteUserContext');
}

/**
 * check if context is still available
 */
function isContextAvailable(c) {
  return Array.from(contextMap.values()).some(x => x.object._hObj === c.object._hObj && x.object._mqQueueManager._hConn === c.object._mqQueueManager._hConn && x.object._name === c.object._name);
}

/*
 * Get rid of all the saved information on a connection.
 */
function deleteUserConnection(hConn) {
  log.traceEntry('deleteUserConnection');
  if (hConn && hConn != -1) {
    var partialKey = hConn + "/";
    for (var key of contextMap.keys()) {
      if (key.startsWith(partialKey) || key.startsWith("-1/")) {
        contextMap.delete(key);
      }
    }
  }
  log.traceExit('deleteUserConnection');
}

exports.deleteUserContext = deleteUserContext;
exports.deleteUserConnection = deleteUserConnection;

/*********************************************************************
 * Functions to deal with async get. Start with the exported function
 * that the application calls.
 * 
 * We don't need to check the parameters in this function, as that has
 * already been done in the main entrypoint.
 */
exports.GetAsync = function (jsObject, jsmd, jsgmo, cb) {
  log.traceEntry('GetAsync');

  log.debug("Async GET setup: %j", jsObject);

  // Save information needed for the real MQGET operation
  var c = setUserContext(jsObject, cb);
  c.jsgmo = jsgmo;
  c.jsmd = jsmd;

  // Intial wait interval from the GMO
  c.WaitInterval = jsgmo.WaitInterval;

  if (tuningParameters.getLoopPollTimeMs < getLoopPollTimeMsMin) {
    tuningParameters.getLoopPollTimeMs = getLoopPollTimeMsMin;
  }

  log.debug("scheduledGetLoop ?", scheduledGetLoop);
  // And start the retrieval loop if necessary
  if (!scheduledGetLoop || getLoop == null) {
    scheduledGetLoop = true;
    getLoop = setTimeoutLogged(pollAllHConns, 0);
  }
  log.traceExit('Get');
};

/* Holds the timed loop for retrieval
 */
var getLoop = null;
var scheduledGetLoop = false;

/* When looping, get from each hConn in a random order to try to avoid starvation
 */
function shuffle(array) {
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

// Maintain hConns that are being polled for new messages
var hConnsInPoll = new Set();

// Try to affect the polling loops by counting retrieved messages
var messagesRetrievedInHConnPoll = 0; // Not necessarily accurate when multiple hconns are in use but sufficient for our use

/* Update the list of hConns with active MQGETs
 */
function pollAllHConns() {
  log.traceEntry('pollAllHConns');
  if (contextMap.size > 0) {
    let hConnsToPoll = getFreshHconnsForPoll();
    for (let hConn of hConnsToPoll) {
      if (hConn != -1) {
        hConnsInPoll.add(hConn);
        pollPerHconn(hConn);
      } else {
        hConnsInPoll.delete(hConn);
      }
    }
  }

  if (contextMap.size == 0) {
    log.debug("No more hConns waiting for messages. Exiting getLoopFunction");
    resetGetLoop();
  }
  log.traceExit('pollAllHConns');
}

function resetGetLoop() {
  log.traceEntry('resetGetLoop');
  scheduledGetLoop = false;
  getLoop = null;
  log.traceExit('resetGetLoop');
}

/*
 * Subloop to poll all queues for the given hConn
 */
function pollPerHconn(hConn) {
  log.traceEntry('pollPerHconn');
  log.debug('Executing pollPerHconn for hConn: ' + hConn);

  messagesRetrievedInHConnPoll = 0;

  let hObjsToPoll = getAllContextsForPoll(hConn);

  if (hObjsToPoll.length === 0 || hConn == -1) {
    hConnsInPoll.delete(hConn);
    log.debug('The hConn has no associated hObj outstanding');
    log.traceExit('pollPerHconn');
    return;
  }

  // reset all states
  for (let c of hObjsToPoll) {
    c.state = 'running';
    c.retrieved = 0;
  }

  // poll all of the  hObjs for this hConn
  pollHobjs(hConn);
  log.traceExit('pollPerHconn');
}

function pollHobjs(hConn) {
  var c;

  log.traceEntry('pollHobjs');

  if (hConn == -1) {
    log.debug("Connection to qmgr seems to be broken");
    log.traceExit('pollHobjs');
    return;
  }

  var hObjsToPoll = getAllContextsForPoll(hConn);
  var nonWaitingContexts = getRunningContexts(hObjsToPoll);

  // if there is nothing to do, delay polling
  scheduledGetLoop = false;
  if (messagesRetrievedInHConnPoll > 0) {
    log.debug("Got some messages on last poll so going round again for " + hConn);
    var activeHConn = hConnsInPoll.size;
    log.debug("Active hConn count = " + activeHConn);
    scheduledGetLoop = true;
    log.traceExit('pollHobjs', "delay for %d", tuningParameters.getLoopDelayTimeMs);
    return setTimeoutLogged(pollPerHconn.bind(null, hConn), tuningParameters.getLoopDelayTimeMs);
  } else if (nonWaitingContexts.length === 0) {
    log.debug("Waiting a while for " + hConn);
    scheduledGetLoop = true;
    log.traceExit('pollHobjs', "delay for %d", tuningParameters.getLoopPollTimeMs);
    return setTimeoutLogged(pollPerHconn.bind(null, hConn), tuningParameters.getLoopPollTimeMs);
  }

  // hoping randomness will fix the fairness issue
  shuffle(nonWaitingContexts); // TODO: can we do something about longest waiting for service?

  // Pick the first of the shuffled deck of hObjs
  if (nonWaitingContexts.length > 0) {
    c = nonWaitingContexts[0];
    log.debug(util.format("pollHObjs: About to work on #%d from %d for %s/%d", 0, nonWaitingContexts.length, c.object._hObj, hConn));
  } else {
    c = null;
  }

  if (c != null) {
    c.retrieved = 0;
    initGet(c);
  } else {
    log.debug("pollHObjs: No waiting contexts for " + hConn);
  }
  log.traceExit('pollHobjs');
}

/*
 * get all non waiting contexts
 */
function getRunningContexts(hObjsToPoll) {
  let ret = hObjsToPoll.filter(c => c.state === 'running');
  if (!ret) {
    ret = [];
  }
  return ret;
}

/*
 * get all contexts (references to hObjs) for a given hConn
 */
function getAllContextsForPoll(hConn) {
  log.traceEntry('getAllContextsForPoll');
  let ret = Array.from(contextMap.values()).filter(c => c.object._mqQueueManager._hConn === hConn);
  log.traceExit('getAllContextsForPoll', "context count: %d", ret ? ret.length : 0);
  return ret;
}

/*
 * Gets all recently added hConns
 */
function getFreshHconnsForPoll() {
  log.traceEntry('getFreshHconnsForPoll');
  // pull all hConns from the contextMap
  let allHconns = Array.from(contextMap.values()).map(c => c.object._mqQueueManager._hConn);
  // extract the unique ones
  let uniqHconns = Array.from(new Set(allHconns).values());
  // get the current list of in progress hConns
  let currentHconnsInPoll = Array.from(hConnsInPoll.values());
  let result = [];
  for (let hc of uniqHconns) {
    if (!currentHconnsInPoll.includes(hc)) {
      result.push(hc);
    }
  }
  log.debug("getFreshHConnsforPoll returning " + result);
  log.traceExit('getFreshHconnsForPoll');
  return result;
}

/*
* Going via this function helps if I want to log activity. Though the debug
* is commented out anyway - I can just edit it in devt work
*/
function setTimeoutLogged(a, b) {
  log.trace('setTimeoutLogged', null, "Set %o to %d", a.name, b);
  return setTimeout(a, b);
}

function initGet(c) {
  log.traceEntry('initGet');
  if (c) {
    // Create copies of the original request parameters as they
    // may be modified during the GET processing. Object.assign()
    // does not copy the buffers, so have to do that manually.
    var jsgmo = Object.assign(new MQGMO.MQGMO(), c.jsgmo);
    jsgmo.MsgToken = Buffer.from(c.jsgmo.MsgToken);

    var jsmd = Object.assign(new MQMD.MQMD(), c.jsmd);
    if (c.jsmd.Format != null) {
      jsmd.Format = Buffer.from(c.jsmd.Format);
    } else {
      jsmd.Format = Buffer.alloc(8);
    }
    jsmd.CorrelId = Buffer.from(c.jsmd.CorrelId);
    jsmd.MsgId = Buffer.from(c.jsmd.MsgId);
    jsmd.GroupId = Buffer.from(c.jsmd.GroupId);
    jsmd.AccountingToken = Buffer.from(c.jsmd.AccountingToken);

    // Try to retrieve the message immediately
    pollHObj(c, jsmd, jsgmo);
  }
  log.traceExit('initGet');
}


/*
 * This function simulates asynch retrieval by issuing MQGET calls
 * on each poll rather than using MQCB/MQCTL. The remaining
 * WaitInterval is checked on each iteration until that timer expires,
 * when the calling application is given 2033 exception. The app can then
 * choose to cancel the outstanding get for that hObj.The retrieval is
 * using MQGET, but via the FFI .async mechanism
 */
function pollHObj(c, jsmd, jsgmo) {
  log.traceEntry('pollHobj');
  // kickoff the poll
  pollHObjInternal();

  function pollHObjInternal() {
    log.traceEntry('pollHobjInternal');
    // check if hConn is being used
    if (isLocked(c.object._mqQueueManager._hConn)) {
      log.traceExit('pollHobjInternal', 'isLocked');
      return setImmediate(pollHObjInternal);
    } else {
      lock(c.object._mqQueueManager._hConn);
    }

    log.debug(util.format("PollHObjInternal: q = %s Get/HConn %d Get/HObj %d",
      c.object._name, messagesRetrievedInHConnPoll, c.retrieved));

    var retryTruncation;

    jsgmo.WaitInterval = 0; // Always do an immediate MQGET with no wait interval

    // Make sure that the GMO flags are suitable, regardless of the
    // original request by turning off some options.
    
    jsgmo.Options &= ~(MQC.MQGMO_WAIT | MQC.MQGMO_ACCEPT_TRUNCATED_MSG);

    // Resize the buffer if necessary from a previous attempt
    retryTruncation = false;
    if (c.buf == null || c.buf.length < c.bufSize) {
      c.buf = Buffer.alloc(c.bufSize);
    }
  
    log.debug("Pre-GET. c.object=%o jsmd=%o jsgmo=%o buf=%o",c.object,jsmd,jsgmo,c.buf);
    mqnapi.Get(c.object._mqQueueManager._hConn,
      c.object._hObj,
      jsmd, jsgmo,
      c.buf, function(result) {

        unlock(c.object._mqQueueManager._hConn);

        var jsRc = result.jsRc;
        var jsCc = result.jsCc;
        var jsDatalen = result.jsDatalen;
      
        //log.debug(util.format("RC from MQGET-async for %s is %d",c.object._name, jsRc));

        var err = new MQError(jsCc, jsRc, "GET");

        if (c.cb) {
          if (jsCc != MQC.MQCC_OK) {

            // Has the wait interval expired?
            var now = Date.now();
            var timeDiff = now - c.WaitStartTime;
            var waitExpired;

            if (c.WaitInterval == MQC.MQWI_UNLIMITED) {
              waitExpired = false;
            } else if (timeDiff < c.WaitInterval) {
              waitExpired = false;
            } else {
              waitExpired = true;
            }
            log.debug(util.format("MQRC: %d hObj %j WaitStartTime: %d Now: %d  WaitInterval: %d diff: %d waitExpired: %j",
              jsRc, c.object, c.WaitStartTime, now, c.WaitInterval, timeDiff, waitExpired));

            if (jsRc == MQC.MQRC_TRUNCATED_MSG_FAILED) {
              // If we need to resize the buffer, then do that and retry.
              retryTruncation = true;
              c.bufSize = c.bufSize * 2;
              if (c.bufSize > maxBufSize) {
                c.bufSize = maxBufSize;
              }
              // poll again immediately to get the entire message
              log.traceExit('pollHobjInternal');
              return setTimeoutLogged(pollHObjInternal, 0);
            } else if (jsRc == MQC.MQRC_NO_MSG_AVAILABLE && !waitExpired) {
              log.debug(util.format("Wait has not expired for hObj %j", c.object));

              // If we appear to be the only hObj in use in this app for MQGET, then delay here. Otherwise
              // let the higher level loops determine delays on the next poll attempt
              if (contextMap.size <= 1) {
                log.debug("No message found in this run so delaying next poll");
                log.traceExit('pollHobjInternal', "Delay:%d", tuningParameters.getLoopPollTimeMs);
                return setTimeoutLogged(pollHObjInternal, tuningParameters.getLoopPollTimeMs);
              }
            } else {
              log.debug("Returning error " + jsRc);
              c.state = 'waiting';
              // send back err for all cases
              c.cb(err, c.object, null, null, null, c.object._mqQueueManager);
              deleteUserContext(c.object);
            }
          } else {
            // Got a message. Call the user's callback function.
            c.state = 'waiting';
            c.retrieved++;
            c.cb(null, c.object, jsgmo, jsmd, c.buf ? c.buf.slice(0, jsDatalen) : null, c.object._mqQueueManager);
            c.state = 'running';
            // Reset information about get-wait in preparation for the next loop
            c.WaitInterval = c.jsgmo.WaitInterval;
            c.WaitStartTime = Date.now();
            // GMO Options might have changed in callback - in particular browse first-> browse next
            c.jsgmo.Options = jsgmo.Options;

            // If we have retrieved a message, then look to see if
            // we should reduce the buffer size for next time round on this queue.
            // Using a simple heuristic here, taking 90% of buffer if previous
            // message fit.
            if (c.bufSize > defaultBufSize && ((c.bufSize * 90) / 100 > jsDatalen)) {
              c.bufSize = Math.floor((c.bufSize * 90) / 100);
              if (c.bufSize < defaultBufSize) {
                c.bufSize = defaultBufSize;
              }
            }

            // Keep approximate count of messages received
            messagesRetrievedInHConnPoll += 1;

            log.debug(util.format("Retrieved %d for queue %s/%s %d", c.retrieved, c.object._name, c.object._mqQueueManager._hConn, c.object._hObj));
            if (c.retrieved < tuningParameters.maxConsecutiveGets) {
              log.traceExit('pollHobjInternal', "Delay:%d", 0);
              return setTimeoutLogged(pollHObjInternal, 0);
            }
          }
        }
        // If we get here, then we are going to try all the hObjs for this connection again
        pollHobjs(c.object._mqQueueManager._hConn);
      });
    log.traceExit('pollHobjInternal');
  }
  log.traceExit('pollHobj');
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

  var userContext = getUserContext(jsObject);
  var err;

  if (!userContext) {
    err = new MQError(MQC.MQCC_FAILED, MQC.MQRC_HOBJ_ERROR, "GetDone");
  } else {
    deleteUserContext(jsObject);
  }

  if (contextMap.size == 0) {
    resetGetLoop();
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
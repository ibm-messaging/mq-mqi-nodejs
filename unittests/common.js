"use strict";
/*
  Copyright (c) IBM Corporation 2025, 2026

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

/*
 * Shared configuration and MQ promise helpers for the ibmmq unit test suite.
 *
 * Configuration is read from positional arguments that follow a "--" separator
 * (node:test passes its own flags before "--"):
 *
 *   node --test unittests/tc_basic.js -- [qmgr [queue [topic \
 *     [clientHost [clientChannel [clientUser [clientPass \
 *     [tlsHost [tlsChannel [tlsCipher [tlsKeyRepo]]]]]]]]]]
 *
 * All parameters are optional; defaults are shown in the constants below.
 */

const mq = require("..");
const MQC = mq.MQC;
const StringDecoder = require("string_decoder").StringDecoder;
const decoder = new StringDecoder("utf8");

// ---------------------------------------------------------------------------
// Configuration — three-tier priority (lowest → highest):
//   1. Built-in defaults
//   2. JSON config file  (--config <path> in consumer args)
//   3. Positional args   (after "--" separator)
//
// Usage:
//   node --test unittests/tc_basic.js [-- [--config config.json] \
//     [qmgr [queue [topic [clientHost [clientChannel [clientUser \
//     [clientPass [tlsHost [tlsChannel [tlsCipher [tlsKeyRepo]]]]]]]]]]]]
// ---------------------------------------------------------------------------
const fs = require("fs");
const path = require("path");

const rawArgs = process.argv.slice(2);
// node:test passes its own flags before "--"; consumer args follow "--"
const sepIdx = rawArgs.indexOf("--");
const args   = sepIdx >= 0 ? rawArgs.slice(sepIdx + 1) : rawArgs;

// Pull --config <path> out of consumer args (does not shift positional slots)
let cfg = {};
const cfgIdx = args.indexOf("--config");
if (cfgIdx !== -1) {
  const cfgPath = args[cfgIdx + 1];
  if (!cfgPath) throw new Error("--config requires a file path argument");
  try {
    cfg = JSON.parse(fs.readFileSync(path.resolve(cfgPath), "utf8"));
  } catch (e) {
    throw new Error(`Failed to load config file "${cfgPath}": ${e.message}`);
  }
  // Remove --config and its value so they don't interfere with positional slots
  args.splice(cfgIdx, 2);
}

// Positional args override JSON config which overrides built-in defaults
const QMGR    = args[0]  || cfg.qmgr          || "QM1";
const QUEUE   = args[1]  || cfg.queue          || "DEV.QUEUE.1";
const TOPIC   = args[2]  || cfg.topic          || "dev/JSTopic";

// Client-connection parameters (TC6)
const CLIENT_HOST    = args[3] || cfg.clientHost    || "localhost(1414)";
const CLIENT_CHANNEL = args[4] || cfg.clientChannel || "DEV.APP.SVRCONN";
const CLIENT_USER    = args[5] || cfg.clientUser    || "app";
const CLIENT_PASS    = args[6] || cfg.clientPass    || "passw0rd";

// TLS connection parameters (TC7)
const TLS_HOST    = args[7]  || cfg.tlsHost    || "localhost(1414)";
const TLS_CHANNEL = args[8]  || cfg.tlsChannel || "SYSTEM.SSL.SVRCONN";
const TLS_CIPHER  = args[9]  || cfg.tlsCipher  || "ANY_TLS12_OR_HIGHER";
const TLS_KEYREPO = args[10] || cfg.tlsKeyRepo || "/var/mqm/ssl/key";

// ---------------------------------------------------------------------------
// MQ promise helpers — thin wrappers so test bodies stay readable
// ---------------------------------------------------------------------------

function connx(qmgr) {
  return new Promise((resolve, reject) => {
    const cno = new mq.MQCNO();
    cno.Options = MQC.MQCNO_NONE;
    mq.Connx(qmgr, cno, (err, hConn) => {
      if (err) reject(err); else resolve(hConn);
    });
  });
}

function connxWithCno(qmgr, cno) {
  return new Promise((resolve, reject) => {
    mq.Connx(qmgr, cno, (err, hConn) => {
      if (err) reject(err); else resolve(hConn);
    });
  });
}

function disc(hConn) {
  return new Promise((resolve, reject) => {
    mq.Disc(hConn, (err) => {
      if (err) reject(err); else resolve();
    });
  });
}

function open(hConn, objectName, objectType, openOptions) {
  return new Promise((resolve, reject) => {
    const od = new mq.MQOD();
    if (objectType === MQC.MQOT_TOPIC)
      od.ObjectString = objectName;
    else
      od.ObjectName = objectName;
    od.ObjectType = objectType;
    mq.Open(hConn, od, openOptions, (err, hObj) => {
      if (err) reject(err); else resolve(hObj);
    });
  });
}

function close(hObj, closeOptions) {
  return new Promise((resolve, reject) => {
    mq.Close(hObj, closeOptions || 0, (err) => {
      if (err) reject(err); else resolve();
    });
  });
}

function put(hObj, msg) {
  return new Promise((resolve, reject) => {
    const mqmd = new mq.MQMD();
    const pmo  = new mq.MQPMO();
    pmo.Options = MQC.MQPMO_NO_SYNCPOINT |
                  MQC.MQPMO_NEW_MSG_ID   |
                  MQC.MQPMO_NEW_CORREL_ID;
    mq.Put(hObj, mqmd, pmo, Buffer.from(msg, "utf8"), (err) => {
      if (err) reject(err); else resolve(mqmd.MsgId);
    });
  });
}

function getByMsgId(hObj, msgId) {
  return new Promise((resolve, reject) => {
    const buf  = Buffer.alloc(4096);
    const mqmd = new mq.MQMD();
    const gmo  = new mq.MQGMO();
    gmo.Options = MQC.MQGMO_NO_SYNCPOINT |
                  MQC.MQGMO_NO_WAIT      |
                  MQC.MQGMO_CONVERT      |
                  MQC.MQGMO_FAIL_IF_QUIESCING;
    gmo.MatchOptions = MQC.MQMO_MATCH_MSG_ID;
    for (let i = 0; i < MQC.MQ_MSG_ID_LENGTH; i++) mqmd.MsgId[i] = msgId[i];
    mq.GetSync(hObj, mqmd, gmo, buf, (err, len) => {
      if (err) reject(err);
      else resolve({ body: decoder.write(buf.slice(0, len)), mqmd });
    });
  });
}

function inq(hObj, selectors) {
  return new Promise((resolve, reject) => {
    try { mq.Inq(hObj, selectors); resolve(selectors); }
    catch (err) { reject(err); }
  });
}

function crtMh(hConn) {
  return new Promise((resolve, reject) => {
    mq.CrtMh(hConn, new mq.MQCMHO(), (err, mh) => {
      if (err) reject(err); else resolve(mh);
    });
  });
}

function dltMh(hConn, mh) {
  return new Promise((resolve, reject) => {
    mq.DltMh(hConn, mh, new mq.MQDMHO(), (err) => {
      if (err) reject(err); else resolve();
    });
  });
}

function sub(hConn, topicString) {
  return new Promise((resolve, reject) => {
    const sd = new mq.MQSD();
    sd.ObjectString = topicString;
    sd.Options = MQC.MQSO_CREATE | MQC.MQSO_NON_DURABLE | MQC.MQSO_MANAGED;
    mq.Sub(hConn, null, sd, (err, hObj, hSub) => {
      if (err) reject(err); else resolve({ hObj, hSub });
    });
  });
}

module.exports = {
  mq, MQC, decoder,
  // config
  QMGR, QUEUE, TOPIC,
  CLIENT_HOST, CLIENT_CHANNEL, CLIENT_USER, CLIENT_PASS,
  TLS_HOST, TLS_CHANNEL, TLS_CIPHER, TLS_KEYREPO,
  // helpers
  connx, connxWithCno, disc,
  open, close,
  put, getByMsgId,
  inq,
  crtMh, dltMh,
  sub,
};

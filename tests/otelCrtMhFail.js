"use strict";
/*
  Copyright (c) IBM Corporation 2026

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
 * To be run as "node tests/otelCrtMhFail.js [-good]"
 *
 * No queue manager or MQ client library is needed: this drives the mqiotel
 * "before" hooks directly with a stubbed MQI, so we can make the MQCRTMH that
 * mqiotel issues for itself fail - something that cannot be provoked through
 * the public API.
 *
 * When that MQCRTMH failed, mqiotel used to store the undefined handle into the
 * application's PMO/GMO, and the application's MQPUT/MQGET then died with
 * "TypeError: Cannot convert undefined to a BigInt" while copying the structure.
 * Trace propagation is best-effort, so it must be skipped instead, leaving the
 * application's structures alone.
 *
 * Run with "-good" to check the working path still puts our handle in place.
 */

// mqiotel only instruments anything if the OTEL API module is in the environment
try {
    require("@opentelemetry/api");
} catch (e) {
    console.log("SKIP: @opentelemetry/api is not installed");
    process.exit(0);
}

const mqotel = require("../lib/mqiotel.js");
const MQC = require("../lib/mqidefs.js");
const mqpmo = require("../lib/mqpmo.js");
const mqgmo = require("../lib/mqgmo.js");
const mqmd = require("../lib/mqmd.js");

const crtMhWorks = process.argv.includes("-good");
const goodHandle = BigInt(5);
const noHandle = BigInt(MQC.MQHM_NONE);

function stubError(mqrc, verb) {
    const err = new Error(verb + ": MQCC = MQCC_FAILED mqrc = " + mqrc);
    err.mqcc = MQC.MQCC_FAILED;
    err.mqrc = mqrc;
    return err;
}

// Stand in for the mqi.js exports that mqiotel calls back into
mqotel.mq.mqi = {
    CrtMh: function (hConn, cmho, cb) {
        if (crtMhWorks) {
            cb(null, goodHandle);
        } else {
            cb(stubError(MQC.MQRC_HCONN_ERROR, "CRTMH"));
        }
    },
    DltMh: function (hConn, mh, dmho, cb) { cb(null); },
    SetMp: function (hConn, mh, smpo, name, pd, value, cb) { cb(null); },
    InqMp: function (hConn, mh, impo, pd, name, buf, cb) {
        cb(stubError(MQC.MQRC_PROPERTY_NOT_AVAILABLE, "INQMP"));
    }
};

const hConn = { _hConn: 1 };
const hObj = { _hObj: 2, _mqQueueManager: hConn };

let failures = 0;
function check(label, fn) {
    try {
        fn();
        console.log("ok   : " + label);
    } catch (err) {
        failures++;
        console.log("FAIL : " + label + "\n       " + err.constructor.name + ": " + err.message);
    }
}

console.log("MQCRTMH " + (crtMhWorks ? "succeeds" : "fails"));

check("MQPUT", function () {
    const pmo = new mqpmo.MQPMO();
    mqotel.putOtelTraceBefore(hConn, new mqmd.MQMD(), pmo, Buffer.from("hello"));
    // Where the TypeError used to be thrown
    mqpmo._copyPMOtoBuf(pmo, mqpmo._newBuf());

    const expected = crtMhWorks ? goodHandle : noHandle;
    if (pmo.OriginalMsgHandle !== expected) {
        throw new Error("expected OriginalMsgHandle " + expected + ", got " + pmo.OriginalMsgHandle);
    }
});

check("MQGET with MQGMO_NO_PROPERTIES", function () {
    const gmo = new mqgmo.MQGMO();
    gmo.Options = MQC.MQGMO_NO_SYNCPOINT | MQC.MQGMO_NO_PROPERTIES;
    mqotel.getOtelSyncTraceBefore(hConn, hObj, gmo);
    mqgmo._copyGMOtoBuf(gmo, mqgmo._newBuf());

    const inHandle = (gmo.Options & MQC.MQGMO_PROPERTIES_IN_HANDLE) != 0;
    const noProps = (gmo.Options & MQC.MQGMO_NO_PROPERTIES) != 0;
    if (crtMhWorks) {
        if (gmo.MsgHandle !== goodHandle || !inHandle || noProps) {
            throw new Error("expected our handle in the GMO, got MsgHandle=" + gmo.MsgHandle +
                " PROPERTIES_IN_HANDLE=" + inHandle + " NO_PROPERTIES=" + noProps);
        }
    } else if (gmo.MsgHandle !== noHandle || inHandle || !noProps) {
        throw new Error("expected the application's GMO to be untouched, got MsgHandle=" + gmo.MsgHandle +
            " PROPERTIES_IN_HANDLE=" + inHandle + " NO_PROPERTIES=" + noProps);
    }
});

process.exit(failures == 0 ? 0 : 1);

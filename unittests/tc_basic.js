"use strict";
/*
  Copyright (c) IBM Corporation 2025

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
 * TC1–TC5: Basic connectivity and messaging tests (local bindings).
 *
 * Run individually:
 *   node --test unittests/tc_basic.js [-- qmgr [queue [topic]]]
 *
 * Test cases
 * ----------
 * TC1  Connect / Disconnect
 *      Verifies MQCONN succeeds and MQDISC completes cleanly.
 *
 * TC2  Put / Get round-trip (synchronous)
 *      Puts a unique string message then retrieves it by MsgId.
 *      Checks body content and that MsgId matches.
 *
 * TC3  Queue depth via MQINQ
 *      Opens the queue with MQOO_INQUIRE, reads MQIA_CURRENT_Q_DEPTH after
 *      putting one message and checks the depth increased.
 *
 * TC4  Message properties (SetMp / InqMp)
 *      Puts a message with a string property and an integer property, then
 *      retrieves the message and reads both properties back via InqMp.
 *
 * TC5  Publish / Subscribe
 *      Opens a subscription on a topic, publishes one message to that topic,
 *      then retrieves the publication from the subscription queue.
 */

const { test }  = require("node:test");
const assert    = require("node:assert/strict");

const {
  mq, MQC, decoder,
  QMGR, QUEUE, TOPIC,
  connx, disc,
  open, close,
  put, getByMsgId,
  inq,
  crtMh, dltMh,
  sub,
} = require("./common");

// ---------------------------------------------------------------------------
// TC1 — Connect / Disconnect
// ---------------------------------------------------------------------------
test("TC1: Connect / Disconnect", async () => {
  const hConn = await connx(QMGR);
  assert.ok(hConn != null, "hConn should not be null after MQCONN");
  await disc(hConn);
});

// ---------------------------------------------------------------------------
// TC2 — Put / Get round-trip
// ---------------------------------------------------------------------------
test("TC2: Put/Get round-trip", async () => {
  const payload = `ibmmq-unit-test-${Date.now()}`;
  let hConn, hObj;
  try {
    hConn = await connx(QMGR);
    hObj  = await open(hConn, QUEUE, MQC.MQOT_Q,
                       MQC.MQOO_OUTPUT | MQC.MQOO_INPUT_AS_Q_DEF);

    const msgId = await put(hObj, payload);

    assert.ok(msgId instanceof Uint8Array,
              "MsgId should be a Uint8Array");
    assert.strictEqual(msgId.length, MQC.MQ_MSG_ID_LENGTH,
              `MsgId length should be ${MQC.MQ_MSG_ID_LENGTH}`);

    const { body } = await getByMsgId(hObj, msgId);
    assert.strictEqual(body, payload, "retrieved body should match sent payload");
  } finally {
    if (hObj)  await close(hObj).catch(() => {});
    if (hConn) await disc(hConn).catch(() => {});
  }
});

// ---------------------------------------------------------------------------
// TC3 — Queue depth via MQINQ
// ---------------------------------------------------------------------------
test("TC3: Queue depth via MQINQ", async () => {
  let hConn, hPut, hInq;
  try {
    hConn = await connx(QMGR);
    hInq  = await open(hConn, QUEUE, MQC.MQOT_Q,
                       MQC.MQOO_INQUIRE | MQC.MQOO_INPUT_AS_Q_DEF);

    const before = [new mq.MQAttr(MQC.MQIA_CURRENT_Q_DEPTH)];
    await inq(hInq, before);
    const depthBefore = before[0].value;
    assert.strictEqual(typeof depthBefore, "number",
                       "queue depth should be a number");

    hPut = await open(hConn, QUEUE, MQC.MQOT_Q, MQC.MQOO_OUTPUT);
    await put(hPut, `depth-test-${Date.now()}`);

    const after = [new mq.MQAttr(MQC.MQIA_CURRENT_Q_DEPTH)];
    await inq(hInq, after);
    const depthAfter = after[0].value;

    assert.ok(depthAfter > depthBefore,
              `depth should increase: before=${depthBefore} after=${depthAfter}`);

    // Drain the test message to leave the queue clean
    const gmo = new mq.MQGMO();
    gmo.Options = MQC.MQGMO_NO_SYNCPOINT | MQC.MQGMO_NO_WAIT |
                  MQC.MQGMO_FAIL_IF_QUIESCING;
    mq.GetSync(hInq, new mq.MQMD(), gmo, Buffer.alloc(64), () => {});
  } finally {
    if (hPut)  await close(hPut).catch(() => {});
    if (hInq)  await close(hInq).catch(() => {});
    if (hConn) await disc(hConn).catch(() => {});
  }
});

// ---------------------------------------------------------------------------
// TC4 — Message properties (SetMp / InqMp)
// ---------------------------------------------------------------------------
test("TC4: Message properties (SetMp / InqMp)", async () => {
  let hConn, hObj, mhPut = null, mhGet = null;
  try {
    hConn = await connx(QMGR);
    hObj  = await open(hConn, QUEUE, MQC.MQOT_Q,
                       MQC.MQOO_OUTPUT | MQC.MQOO_INPUT_AS_Q_DEF);

    // Put with properties
    mhPut = await crtMh(hConn);
    const smpo = new mq.MQSMPO();
    const pd   = new mq.MQPD();
    mq.SetMp(hConn, mhPut, smpo, "UNIT.STR", pd, "hello-prop");
    mq.SetMp(hConn, mhPut, smpo, "UNIT.INT", pd, 99);

    const putMqmd = new mq.MQMD();
    const pmo     = new mq.MQPMO();
    pmo.Options = MQC.MQPMO_NO_SYNCPOINT | MQC.MQPMO_NEW_MSG_ID;
    pmo.OriginalMsgHandle = mhPut;
    const sentMsgId = await new Promise((resolve, reject) => {
      mq.Put(hObj, putMqmd, pmo, Buffer.from("prop-body"), (err) => {
        if (err) reject(err); else resolve(putMqmd.MsgId);
      });
    });
    await dltMh(hConn, mhPut);
    mhPut = null;

    // Get with properties
    mhGet = await crtMh(hConn);
    const getMqmd = new mq.MQMD();
    for (let i = 0; i < MQC.MQ_MSG_ID_LENGTH; i++) getMqmd.MsgId[i] = sentMsgId[i];
    const gmo = new mq.MQGMO();
    gmo.Options = MQC.MQGMO_NO_SYNCPOINT  | MQC.MQGMO_NO_WAIT  |
                  MQC.MQGMO_CONVERT       | MQC.MQGMO_FAIL_IF_QUIESCING |
                  MQC.MQGMO_PROPERTIES_IN_HANDLE;
    gmo.MatchOptions = MQC.MQMO_MATCH_MSG_ID;
    gmo.MsgHandle    = mhGet;
    await new Promise((resolve, reject) => {
      mq.GetSync(hObj, getMqmd, gmo, Buffer.alloc(256), (err) => {
        if (err) reject(err); else resolve();
      });
    });

    // Inquire each property by name
    const impo    = new mq.MQIMPO();
    const propBuf = Buffer.alloc(256);
    let strVal, intVal;

    impo.Options = MQC.MQIMPO_CONVERT_VALUE | MQC.MQIMPO_INQ_FIRST;
    mq.InqMp(hConn, mhGet, impo, new mq.MQPD(), "UNIT.STR", propBuf,
      (err, _n, v) => { if (!err) strVal = v; });

    impo.Options = MQC.MQIMPO_CONVERT_VALUE | MQC.MQIMPO_INQ_FIRST;
    mq.InqMp(hConn, mhGet, impo, new mq.MQPD(), "UNIT.INT", propBuf,
      (err, _n, v) => { if (!err) intVal = v; });

    assert.strictEqual(strVal, "hello-prop", "string property should round-trip");
    assert.strictEqual(intVal, 99,           "integer property should round-trip");

    await dltMh(hConn, mhGet);
    mhGet = null;
  } finally {
    if (mhPut) await dltMh(hConn, mhPut).catch(() => {});
    if (mhGet) await dltMh(hConn, mhGet).catch(() => {});
    if (hObj)  await close(hObj).catch(() => {});
    if (hConn) await disc(hConn).catch(() => {});
  }
});

// ---------------------------------------------------------------------------
// TC5 — Publish / Subscribe
// ---------------------------------------------------------------------------
test("TC5: Publish / Subscribe", async () => {
  const payload = `pub-sub-test-${Date.now()}`;
  let hConn, hSubQObj = null, hSubObj = null, hPub = null;
  try {
    hConn = await connx(QMGR);

    // Subscribe before publishing so the publication is not lost
    ({ hObj: hSubQObj, hSub: hSubObj } = await sub(hConn, TOPIC));

    hPub = await open(hConn, TOPIC, MQC.MQOT_TOPIC, MQC.MQOO_OUTPUT);
    await put(hPub, payload);
    await close(hPub);
    hPub = null;

    // Retrieve the publication from the managed subscription queue
    const buf  = Buffer.alloc(4096);
    const gmo  = new mq.MQGMO();
    gmo.Options = MQC.MQGMO_NO_SYNCPOINT | MQC.MQGMO_WAIT |
                  MQC.MQGMO_CONVERT      | MQC.MQGMO_FAIL_IF_QUIESCING;
    gmo.WaitInterval = 5000; // ms
    const received = await new Promise((resolve, reject) => {
      mq.GetSync(hSubQObj, new mq.MQMD(), gmo, buf, (err, len) => {
        if (err) reject(err);
        else resolve(decoder.write(buf.slice(0, len)));
      });
    });

    assert.strictEqual(received, payload,
                       "received publication should match sent payload");
  } finally {
    if (hPub)     await close(hPub).catch(() => {});
    if (hSubObj)  await close(hSubObj,  MQC.MQCO_NONE).catch(() => {});
    if (hSubQObj) await close(hSubQObj, MQC.MQCO_NONE).catch(() => {});
    if (hConn)    await disc(hConn).catch(() => {});
  }
});

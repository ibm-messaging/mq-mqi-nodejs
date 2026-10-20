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
 * TC6: Client-mode connection tests (MQCNO_CLIENT_BINDING + MQCD + MQCSP).
 *
 * Run individually:
 *   node --test unittests/tc_client.js \
 *     [-- qmgr queue topic clientHost clientChannel clientUser clientPass]
 *
 * Test cases
 * ----------
 * TC6a  Successful client connect and disconnect with valid credentials.
 * TC6b  Bad credentials → MQRC_NOT_AUTHORIZED (or MQCC_FAILED if security
 *       is enforced; silently skipped if the queue manager has no security).
 * TC6c  Unreachable host (port 19999) → connection-refused / MQCC_FAILED.
 */

const { test }  = require("node:test");
const assert    = require("node:assert/strict");

const {
  mq, MQC,
  QMGR,
  CLIENT_HOST, CLIENT_CHANNEL, CLIENT_USER, CLIENT_PASS,
  connxWithCno, disc,
} = require("./common");

// ---------------------------------------------------------------------------
// Helper — build a client-mode CNO
// ---------------------------------------------------------------------------

/**
 * Build a client-mode CNO pointing at the given host/channel.
 * Pass userId/password to authenticate via MQCSP.
 */
function buildClientCno(host, channel, userId, password) {
  const cno = new mq.MQCNO();
  cno.Options = MQC.MQCNO_CLIENT_BINDING;

  const cd = new mq.MQCD();
  cd.ConnectionName = host;
  cd.ChannelName    = channel;
  cno.ClientConn    = cd;

  if (userId) {
    const csp      = new mq.MQCSP();
    csp.UserId     = userId;
    csp.Password   = password || "";
    cno.SecurityParms = csp;
  }

  return cno;
}

// ---------------------------------------------------------------------------
// TC6a — successful client connect and disconnect
// ---------------------------------------------------------------------------
test("TC6a: Client connect / disconnect (valid credentials)", async () => {
  const cno = buildClientCno(CLIENT_HOST, CLIENT_CHANNEL, CLIENT_USER, CLIENT_PASS);
  let hConn;
  try {
    hConn = await connxWithCno(QMGR, cno);
    assert.ok(hConn != null, "hConn should not be null after client MQCONN");
  } finally {
    if (hConn) await disc(hConn).catch(() => {});
  }
});

// ---------------------------------------------------------------------------
// TC6b — bad password → MQRC_NOT_AUTHORIZED
// ---------------------------------------------------------------------------
test("TC6b: Client connect with bad credentials → MQRC_NOT_AUTHORIZED", async () => {
  const cno = buildClientCno(CLIENT_HOST, CLIENT_CHANNEL, "WRONG_USERID", "WRONG_PASSWORD_XYZ");
  let hConn;
  try {
    hConn = await connxWithCno(QMGR, cno);
    // If the queue manager has security disabled this may succeed; skip gracefully.
    await disc(hConn).catch(() => {});
    hConn = null;
  } catch (err) {
    assert.ok(
      err.mqrc === MQC.MQRC_NOT_AUTHORIZED || err.mqcc === MQC.MQCC_FAILED,
      `expected MQRC_NOT_AUTHORIZED or MQCC_FAILED, got mqrc=${err.mqrc} mqcc=${err.mqcc}`
    );
  }
});

// ---------------------------------------------------------------------------
// TC6c — unreachable host → connection failure (any non-OK completion code)
// ---------------------------------------------------------------------------
test("TC6c: Client connect to unreachable host → connection failure", async () => {
  // Port 19999 is chosen to be almost certainly unbound on localhost.
  const cno = buildClientCno("localhost(19999)", CLIENT_CHANNEL, null, null);
  let hConn;
  try {
    hConn = await connxWithCno(QMGR, cno);
    // Reaching here means the connect unexpectedly succeeded — fail.
    await disc(hConn).catch(() => {});
    assert.fail("Expected connection to unreachable host to fail");
  } catch (err) {
    // Any MQError or socket error is acceptable — we just need a failure.
    assert.ok(
      err.mqcc === MQC.MQCC_FAILED || err.mqrc != null || err.code != null,
      `expected a connection failure, got: ${err.message}`
    );
  }
});

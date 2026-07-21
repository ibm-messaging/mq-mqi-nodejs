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
 * TC7: TLS client connection tests (MQCD.SSLCipherSpec + MQSCO.KeyRepository).
 *
 * Run individually:
 *   node --test unittests/tc_tls.js \
 *     [-- qmgr queue topic clientHost clientChannel clientUser clientPass \
 *         tlsHost tlsChannel tlsCipher tlsKeyRepo]
 *
 * Test cases
 * ----------
 * TC7a  Successful TLS connect using a keystore that contains the queue
 *       manager signing certificate.
 * TC7b  Wrong CipherSpec on the MQCD → SSL/TLS handshake failure.
 * TC7c  Non-existent keystore path → MQRC_SSL_INITIALIZATION_ERROR
 *       or MQRC_SSL_CERT_STORE_ERROR.
 */

const { test }  = require("node:test");
const assert    = require("node:assert/strict");

const {
  mq, MQC,
  QMGR,
  CLIENT_USER, CLIENT_PASS,
  TLS_HOST, TLS_CHANNEL, TLS_CIPHER, TLS_KEYREPO,
  connxWithCno, disc,
} = require("./common");

// ---------------------------------------------------------------------------
// Helper — build a TLS-enabled client CNO
// ---------------------------------------------------------------------------

/**
 * Build a TLS-enabled client CNO.
 * @param {string} host        - connection name, e.g. "localhost(1414)"
 * @param {string} channel     - SVRCONN channel with SSLCiph set
 * @param {string} cipherSpec  - CipherSpec string, e.g. "ANY_TLS12_OR_HIGHER"
 * @param {string} keyRepo     - key repository path without file extension
 * @param {string} [userId]    - optional user ID for MQCSP authentication
 * @param {string} [password]  - optional password for MQCSP authentication
 */
function buildTlsCno(host, channel, cipherSpec, keyRepo, userId, password) {
  const cno = new mq.MQCNO();
  cno.Options = MQC.MQCNO_CLIENT_BINDING;

  // Channel definition with TLS cipher
  const cd = new mq.MQCD();
  cd.ConnectionName = host;
  cd.ChannelName    = channel;
  cd.SSLCipherSpec  = cipherSpec;
  cno.ClientConn    = cd;

  // SSL/TLS configuration — point at the key repository
  const sco = new mq.MQSCO();
  sco.KeyRepository = keyRepo;
  cno.SSLConfig     = sco;

  // Optional credentials
  if (userId) {
    const csp    = new mq.MQCSP();
    csp.UserId   = userId;
    csp.Password = password || "";
    cno.SecurityParms = csp;
  }

  return cno;
}

/** Set of MQRC values that indicate an SSL/TLS-layer failure. */
const TLS_FAILURE_CODES = new Set([
  MQC.MQRC_KEY_REPOSITORY_ERROR,
  MQC.MQRC_SSL_INITIALIZATION_ERROR,
  MQC.MQRC_SSL_CERT_STORE_ERROR,
  MQC.MQRC_SSL_CONFIG_ERROR,
  MQC.MQRC_SSL_NOT_ALLOWED,
  MQC.MQRC_SSL_PEER_NAME_ERROR,
  MQC.MQRC_SSL_PEER_NAME_MISMATCH,
  MQC.MQRC_JSSE_ERROR,
  MQC.MQRC_SECURITY_ERROR,
  MQC.MQRC_CHANNEL_NOT_AVAILABLE,
  MQC.MQRC_HOST_NOT_AVAILABLE,
]);

// ---------------------------------------------------------------------------
// TC7a — successful TLS connect using a valid keystore
// ---------------------------------------------------------------------------
test("TC7a: TLS client connect / disconnect (valid keystore)", async () => {
  const cno = buildTlsCno(TLS_HOST, TLS_CHANNEL, TLS_CIPHER, TLS_KEYREPO,
                           CLIENT_USER, CLIENT_PASS);
  let hConn;
  try {
    hConn = await connxWithCno(QMGR, cno);
    assert.ok(hConn != null, "hConn should not be null after TLS MQCONN");
  } finally {
    if (hConn) await disc(hConn).catch(() => {});
  }
});

// ---------------------------------------------------------------------------
// TC7b — mismatched CipherSpec → TLS handshake failure
// ---------------------------------------------------------------------------
test("TC7b: TLS connect with wrong CipherSpec → handshake failure", async () => {
  // "NULL_NULL" is not a valid production cipher; using it ensures the
  // queue manager rejects the handshake regardless of its configured cipher.
  const cno = buildTlsCno(TLS_HOST, TLS_CHANNEL, "NULL_NULL", TLS_KEYREPO,
                           CLIENT_USER, CLIENT_PASS);
  let hConn;
  try {
    hConn = await connxWithCno(QMGR, cno);
    await disc(hConn).catch(() => {});
    assert.fail("Expected TLS handshake with NULL_NULL cipher to fail");
  } catch (err) {
    assert.ok(
      err.mqcc === MQC.MQCC_FAILED ||
      TLS_FAILURE_CODES.has(err.mqrc) ||
      err.mqrc === MQC.MQRC_NOT_AUTHORIZED,
      `expected a TLS failure, got mqrc=${err.mqrc} mqcc=${err.mqcc}: ${err.message}`
    );
  }
});

// ---------------------------------------------------------------------------
// TC7c — non-existent keystore → SSL initialisation error
// ---------------------------------------------------------------------------
test("TC7c: TLS connect with missing keystore → SSL initialisation error", async () => {
  const cno = buildTlsCno(TLS_HOST, TLS_CHANNEL, TLS_CIPHER,
                           "./no-such-keystore-xyz",
                           CLIENT_USER, CLIENT_PASS);
  let hConn;
  try {
    hConn = await connxWithCno(QMGR, cno);
    await disc(hConn).catch(() => {});
    assert.fail("Expected missing keystore to produce an SSL error");
  } catch (err) {
    assert.ok(
      err.mqcc === MQC.MQCC_FAILED &&
      (TLS_FAILURE_CODES.has(err.mqrc) || err.mqrc === MQC.MQRC_Q_MGR_NOT_AVAILABLE),
      `expected SSL init failure, got mqrc=${err.mqrc} mqcc=${err.mqcc}: ${err.message}`
    );
  }
});

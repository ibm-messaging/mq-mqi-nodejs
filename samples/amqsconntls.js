'use strict';
/*
  Copyright (c) IBM Corporation 2017, 2018

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
     Mark Taylor - Initial Contribution
*/

/*
 * This is an example of a Node.js program to connect as a client to an
 * IBM MQ queue manager with a TLS-secured channel.
 *
 * The queue manager name and the CONNAME
 * are set to default values of "QM1" and "localhost(1414)" to demonstrate
 * how to use them but these can be overridden on the command line.
 *
 * The SVRCONN channel is assumed to have been defined with
 *    DEFINE CHL(SYSTEM.SSL.SVRCONN) CHLTYPE(SVRCONN) +
 *        SSLCAUTH(OPTIONAL) +
 *        SSLCIPH(TLS_RSA_WITH_AES_128_CBC_SHA256)
 *
 * It is also assumed that you have a local keystore containing, at minimum,
 * the signing cert to validate the queue manager's certificate. This
 * keystore is in kdb format, and called "mykey" here. All the keystore
 * files should be in the current directory, not just the .kdb but also
 * the .rdb and .sth files.
 *
 * Other non-programmatic ways of connecting to the queue manager are
 * of course also possible, via the CCDT and controls set as environment
 * variables (eg MQSSLKEYR) or in the mqclient.ini file. These are
 * described in the MQ documentation - this node package follows the
 * C client libraries for connectivity.
 */

// Import the MQ package
var mq = require('ibmmq');
var MQC = mq.MQC; // Want to refer to this export directly for simplicity

// The queue manager to be used.
var qMgr = "QM1";
// Where to connect to
var connName = "localhost(1414)";
var hConn;

function formatErr(err) {
  return  "MQ call failed in " + err.message;
}

// When we're done, close connections
function cleanup(hConn) {
}

// Get command line parameters
var myArgs = process.argv.slice(2); // Remove redundant parms
if (myArgs[0]) {
  qMgr  = myArgs[0];
}
if (myArgs[1]) {
  connName  = myArgs[1];
}


// The program starts here.
// Connect to the queue manager.
console.log("Sample AMQSCONNTLS.JS start");

// Create default MQCNO and MQSCO structures
var cno = new mq.MQCNO();
var sco = new mq.MQSCO();

// Add authentication via the MQCSP structure
var csp = new mq.MQCSP();
csp.UserId = "mqguest";
csp.Password = "passw0rd";
// Make the MQCNO refer to the MQCSP so it knows to use the structure
cno.SecurityParms = csp;

// And use the MQCD to programatically connect as a client
// First force the client mode
cno.Options |= MQC.MQCNO_CLIENT_BINDING;

// And then fill in relevant fields for the MQCD
var cd = new mq.MQCD();
cd.ConnectionName = connName;
cd.ChannelName = "SYSTEM.SSL.SVRCONN";

// The TLS parameters are the minimal set needed here. You might
// want more control such as SSLPEER values.
// This SSLClientAuth setting means that this program does not need to
// present a certificate to the server - but it must match how the
// SVRCONN is defined on the queue manager.
// If you have to present a client certificate too then the
// SSLClientAuth is set to MQC.MQSCA_REQUIRED. You may
// also want to set the sco.CertificateLabel to choose  
// which certificate is to be sent.
cd.SSLCipherSpec = "TLS_RSA_WITH_AES_128_CBC_SHA256";
cd.SSLClientAuth = MQC.MQSCA_OPTIONAL;

// Make the MQCNO refer to the MQCD
cno.ClientConn = cd;

// Set the SSL/TLS Configuration Options structure field that
// specifies the keystore (expect to see a .kdb, .sth and .rdb
// with the same root name). For this program, all we need is for
// the keystore to contain the signing information for the queue manager's
// cert.
sco.KeyRepository = "./mykey";
// And make the CNO refer to the SSL Connection Options
cno.SSLConfig = sco;

console.log("Trying to connect to %s at %s",qMgr,connName);
// Now we can try to connect
mq.Connx(qMgr, cno, function(err,conn) {
  if (err) {
    console.log(formatErr(err));
  } else {
    console.log("MQCONN to %s successful ", qMgr);
    mq.Disc(conn, function(err) {
      if (err) {
        console.log(formatErr(err));
      } else {
        console.log("MQDISC successful");
      }
    });
  }
});

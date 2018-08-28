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
 * IBM MQ queue manager.
 *
 * The queue manager name and channel attributes such as CONNAME are hardcoded
 * to demonstrate how to use them.
 *
 * This program also demonstrates how authentication can be achieved with
 * a userid/password option
 */

// Import the MQ package
var mq = require('ibmmq');
var MQC = mq.MQC; // Want to refer to this export directly for simplicity

// The queue manager to be used.
var qMgr = "QM1";
var hConn;

function formatErr(err) {
  return  "MQ call failed in " + err.message;
}

// When we're done, close queues and connections
function cleanup(hConn) {
}

// The program starts here.
// Connect to the queue manager.
console.log("Sample AMQSCONN.JS start");

// Create default MQCNO structure
var cno = new mq.MQCNO();

// Add authentication via the MQCSP structure
var csp = new mq.MQCSP();
csp.UserId = "mqguest";
csp.Password = "passw0rd";
// Make the MQCNO refer to the MQCSP
// Uncomment next line to use the userid/password
cno.SecurityParms = csp;

// And use the MQCD to programatically connect as a client
// First force the client mode
cno.Options |= MQC.MQCNO_CLIENT_BINDING;
// And then fill in relevant fields for the MQCD
var cd = new mq.MQCD();
cd.ConnectionName = "localhost(1414)";
cd.ChannelName = "SYSTEM.DEF.SVRCONN";
// Make the MQCNO refer to the MQCD
cno.ClientConn = cd;

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

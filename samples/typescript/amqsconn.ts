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
     Andre Asselin - Typescript conversion
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
import * as mq from "ibmmq";
import { MQC } from "ibmmq"; // Want to refer to this export directly for simplicity

// The queue manager to be used.
const qMgr = "QM1";

function formatErr(err: Error) {
  return "MQ call failed in " + err.message;
}

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// The program starts here.
// Connect to the queue manager.
console.log("Sample AMQSCONN.TS start");

// Create default MQCNO structure
const cno = new mq.MQCNO();

// Add authentication via the MQCSP structure
const csp = new mq.MQCSP();
csp.UserId = "mqguest";
csp.Password = "passw0rd";
// Make the MQCNO refer to the MQCSP
// This line allows use of the userid/password
cno.SecurityParms = csp;

// And use the MQCD to programatically connect as a client
// First force the client mode
cno.Options |= MQC.MQCNO_CLIENT_BINDING;
// And then fill in relevant fields for the MQCD
const cd = new mq.MQCD();
cd.ConnectionName = "localhost(1414)";
cd.ChannelName = "SYSTEM.DEF.SVRCONN";
// Make the MQCNO refer to the MQCD
cno.ClientConn = cd;

// MQ V9.1.2 allows setting of the application name explicitly
if (MQC.MQCNO_CURRENT_VERSION >= 7) {
  cno.ApplName = "Node.js 9.1.2 ApplName";
}

// Now we can try to connect
mq.Connx(qMgr, cno, function (connErr, conn) {
  if (connErr) {
    console.log(formatErr(connErr));
  } else {
    console.log("MQCONN to %s successful ", qMgr);
    // Sleep for a few seconds - bad in a real program but good for this one
    sleep(3 * 1000)
      .then(() => {
        mq.Disc(conn, function (discErr) {
          if (discErr) {
            console.log(formatErr(discErr));
          } else {
            console.log("MQDISC successful");
          }
        });
      })
      .catch(() => {});
  }
});


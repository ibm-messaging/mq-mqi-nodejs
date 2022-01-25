/*
  Copyright (c) IBM Corporation 2017,2022

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
 * This is an example of a Node.js program to put messages to an IBM MQ
 * queue.
 *
 * The queue and queue manager name can be given as parameters on the
 * command line. Defaults are coded in the program.
 *
 * A single message is put, containing a "hello" and timestamp.
 * Each MQI call prints its success or failure.
 *
 * This program also demonstrates how authentication can be achieved with
 * a userid/password option.
 */

// Import the MQ package
import * as mq from "ibmmq";
import { MQC } from "ibmmq"; // Want to refer to this export directly for simplicity

// The queue manager and queue to be used. These can be overridden on command line.
let qMgr = "QM1";
let qName = "DEV.QUEUE.1";

function formatErr(err: Error) {
  return "MQ call failed in " + err.message;
}

function toHexString(byteArray: Buffer) {
  return byteArray.reduce(
    (output, elem) => output + ("0" + elem.toString(16)).slice(-2),
    ""
  );
}

// Define some functions that will be used from the main flow
function putMessage(hObj: mq.MQObject) {
  const msg = "Hello from Node at " + new Date().toString();

  const mqmd = new mq.MQMD(); // Defaults are fine.
  const pmo = new mq.MQPMO();

  // Describe how the Put should behave
  // The TypeScript interface has a choice of how to provide MQI bitwise
  // value such as the pmo.Options field. This line shows the use of
  // an array instead of the usual bitwise OR code.
  pmo.Options =
    [ MQC.MQPMO_NO_SYNCPOINT,   MQC.MQPMO_NEW_MSG_ID,  MQC.MQPMO_NEW_CORREL_ID];

  mq.Put(hObj, mqmd, pmo, msg, function (err) {
    if (err) {
      console.log(formatErr(err));
    } else {
      console.log("MsgId: " + toHexString(mqmd.MsgId));
      console.log("MQPUT successful");
    }
  });
}

// When we're done, close queues and connections
function cleanup(hConn: mq.MQQueueManager, hObj: mq.MQObject) {
  mq.Close(hObj, 0, function (closeErr) {
    if (closeErr) {
      console.log(formatErr(closeErr));
    } else {
      console.log("MQCLOSE successful");
    }
    mq.Disc(hConn, function (discErr) {
      if (discErr) {
        console.log(formatErr(discErr));
      } else {
        console.log("MQDISC successful");
      }
    });
  });
}

// The program really starts here.
// Connect to the queue manager. If that works, the callback function
// opens the queue, and then we can put a message.

console.log("Sample AMQSPUT.TS start");

// Get command line parameters
const myArgs = process.argv.slice(2); // Remove redundant parms
if (myArgs[0]) {
  qName = myArgs[0];
}
if (myArgs[1]) {
  qMgr = myArgs[1];
}

const cno = new mq.MQCNO();
cno.Options = MQC.MQCNO_NONE; // use MQCNO_CLIENT_BINDING to connect as client

// To add authentication, enable this block
if (false) {
  const csp = new mq.MQCSP();
  csp.UserId = "metaylor";
  csp.Password = "passw0rd";
  cno.SecurityParms = csp;
}

mq.Connx(qMgr, cno, function (connErr, hConn) {
  if (connErr) {
    console.log(formatErr(connErr));
  } else {
    console.log("MQCONN to %s successful ", qMgr);

    // Define what we want to open, and how we want to open it.
    const od = new mq.MQOD();
    od.ObjectName = qName;
    od.ObjectType = MQC.MQOT_Q;
    const openOptions = MQC.MQOO_OUTPUT;
    mq.Open(hConn, od, openOptions, function (openErr, hObj) {
      if (openErr) {
        console.log(formatErr(openErr));
      } else {
        console.log("MQOPEN of %s successful", qName);
        putMessage(hObj);
      }
      cleanup(hConn, hObj);
    });
  }
});


/*
  Copyright (c) IBM Corporation 2017, 2023

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
 * This is an example of a Node.js program to browse messages from an IBM MQ
 * queue using an asynchronous method. This is a non-destructive operation
 *
 * The queue and queue manager name can be given as parameters on the
 * command line. Defaults are coded in the program.
 *
 * Each MQI call prints its success or failure.
 */

// Import the MQ package
import * as mq from "ibmmq";
import { MQC } from "ibmmq"; // Want to refer to this export directly for simplicity

// Import any other packages needed
import { StringDecoder } from "string_decoder";
const decoder = new StringDecoder("utf8");

// The default queue manager and queue to be used
let qMgr = "QM1";
let qName = "DEV.QUEUE.1";

// Some global variables
let connectionHandle: mq.MQQueueManager;
let queueHandle: mq.MQObject;

const waitInterval = 3; // max seconds to wait for a new message
let ok = true;
let exitCode = 0;

/*
 * Format any error messages
 */
function formatErr(err: Error) {
  if (err) {
    ok = false;
    return "MQ call failed at " + err.message;
  } else {
    return "MQ call successful";
  }
}

/*
 * Define which messages we want to get, and how.
 */
function getMessages() {
  const md = new mq.MQMD();
  const gmo = new mq.MQGMO();

  gmo.Options =
    MQC.MQGMO_NO_SYNCPOINT |
    MQC.MQGMO_WAIT |
    MQC.MQGMO_CONVERT |
    MQC.MQGMO_FAIL_IF_QUIESCING;

  // To start with, set the option to browse the FIRST message on the queue
  gmo.Options |= MQC.MQGMO_BROWSE_NEXT;

  gmo.MatchOptions = MQC.MQMO_NONE;
  gmo.WaitInterval = waitInterval * 1000; // 3 seconds

  // Set up the callback handler to be invoked when there
  // are any incoming messages. 
  mq.Get(queueHandle, md, gmo, getCB);
  mq.Ctl(connectionHandle,MQC.MQOP_START);

}

/*
 * This function is the async callback. Parameters
 * include the message descriptor and the buffer containing
 * the message data.
 */
function getCB(
  err: mq.MQError | null,
  hObj: mq.MQObject,
  gmo: mq.MQGMO |null ,
  md: mq.MQMD | null,
  buf: Buffer | null,
  hConn: mq.MQQueueManager
) {
  // If there is an error, prepare to exit by setting the ok flag to false.
  if (err) {
    if (err.mqrc == MQC.MQRC_NO_MSG_AVAILABLE) {
      console.log("No more messages available.");
    } else {
      console.log(formatErr(err));
      exitCode = 1;
    }
    ok = false;
    // We don't need any more messages delivered, so cause the
    // callback to be deleted after this one has completed.
    mq.GetDone(hObj);
  } else {
    if (md!.Format == "MQSTR") {
      console.log("message <%s>", decoder.write(buf!));
    } else {
      console.log(`binary message: ${buf!}`);
    }
    // After the first message has been browsed, change the option
    // to retrieve further messages on the queue.
    //
    // Because the TypeScript definitions allow the MQGMO.Options field to be either an array
    // OR a number, we have to explicitly coerce it to be a number in order to use the bitwise
    // operators. Otherwise we get a compile error. Only the first of the two bitwise lines seems
    // to need the cast; by the time we get to the second line, we know it is a number.
    //
    // The "!" characters are also assertions that the GMO is not a null value
    // even though the parameters to this function could be null. We will have already
    // bailed out if that were the case.
    //
    // First remove the original option using a bitwise operation to clear the flag
    gmo!.Options = ((gmo!.Options as number) & ~MQC.MQGMO_BROWSE_FIRST);
    // And then set the new flag.
    gmo!.Options = (gmo!.Options | MQC.MQGMO_BROWSE_NEXT);
  }
}

/*
 * When we're done, close any queues and connections.
 */
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

/**************************************************************
 * The program really starts here.
 * Connect to the queue manager. If that works, the callback function
 * opens the queue, and then we can start to retrieve messages.
 */
console.log("Sample AMQSBRA.TS start");

// Get command line parameters
const myArgs = process.argv.slice(2); // Remove redundant parms
if (myArgs[0]) {
  qName = myArgs[0];
}
if (myArgs[1]) {
  qMgr = myArgs[1];
}

// Connect to the queue manager, including a callback function for
// when it completes.
mq.Conn(qMgr, function (connErr, hConn) {
  if (connErr) {
    console.log(formatErr(connErr));
  } else {
    console.log("MQCONN to %s successful ", qMgr);
    connectionHandle = hConn;

    // Define what we want to open, and how we want to open it.
    const od = new mq.MQOD();
    od.ObjectName = qName;
    od.ObjectType = MQC.MQOT_Q;
    const openOptions = MQC.MQOO_BROWSE; // Indicate non-destructive retrieval needed
    mq.Open(hConn, od, openOptions, function (openErr, hObj) {
      queueHandle = hObj;
      if (openErr) {
        console.log(formatErr(openErr));
      } else {
        console.log("MQOPEN of %s successful", qName);
        // And now we can ask for the messages to be delivered.
        getMessages();
      }
    });
  }
});

// We need to keep the program active so that the callbacks from the
// message handler are processed. This is one way to do it. Use the
// defined waitInterval with a bit extra added and look for the
// current status. If not OK, then close everything down cleanly.
setInterval(function () {
  if (!ok) {
    console.log("Exiting ...");
    cleanup(connectionHandle, queueHandle);
    process.exit(exitCode);
  }
}, (waitInterval + 2) * 1000);

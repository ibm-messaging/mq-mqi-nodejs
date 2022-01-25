/*
  Copyright (c) IBM Corporation 2017, 2022

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
 * This is an example of a Node.js program to subscribe to publications
 * made through IBM MQ.
 *
 * The topic and queue manager name can be given as parameters on the
 * command line. Defaults are coded in the program.
 *
 */

// Import the MQ package
import * as mq from "ibmmq";
import { MQC } from "ibmmq"; // Want to refer to this export directly for simplicity

// Import any other packages needed
import { StringDecoder } from "string_decoder";
const decoder = new StringDecoder("utf8");

// The queue manager and queue to be used
let qMgr = "QM1";
let topicString = "dev/JSTopic";

// Global variables
let ok = true;


// Define some functions that will be used from the main flow
function getMessages(hObj: mq.MQObject) {
  while (ok) {
    getMessage(hObj);
  }
}

// This function retrieves messages from the queue without waiting using
// the synchronous method for simplicity. See amqsgeta for how to use the
// async method.
function getMessage(hObj: mq.MQObject) {

  const buf = Buffer.alloc(1024);

  const mqmd = new mq.MQMD();
  const gmo = new mq.MQGMO();

  gmo.WaitInterval = 3 * 1000; // 3 seconds
  gmo.Options = MQC.MQGMO_NO_SYNCPOINT |
                MQC.MQGMO_WAIT |
                MQC.MQGMO_CONVERT |
                MQC.MQGMO_FAIL_IF_QUIESCING;

  mq.GetSync(hObj,mqmd,gmo,buf,function(err,len) {
    if (err) {
       if (err.mqrc == MQC.MQRC_NO_MSG_AVAILABLE) {
         console.log("no more messages");
       } else {
         console.log("MQGET failed with " + err.mqrc.toString());
       }
       ok = false;
    } else {
      if (mqmd.Format=="MQSTR") {
        console.log("message <%s>", decoder.write(buf.slice(0,len)));
      } else {
        console.log("binary message: " + buf.toString());
      }
    }
  });
}

// When we're done, close queues and connections
function cleanup(hConn: mq.MQQueueManager, hObjPubQ: mq.MQObject, hObjSubscription: mq.MQObject) {
  // Demonstrate two ways of closing queues - first using an exception, then
  // the version with callback.
  try {
    mq.CloseSync(hObjSubscription,0);
    console.log("MQCLOSE (Subscription) successful");
  } catch (err) {
    const mqerr = err as mq.MQError;
    console.log("MQCLOSE (Subscription) ended with reason "  + mqerr.toString());
  }

  mq.Close(hObjPubQ, 0, function(closeErr) {
    if (closeErr) {
      console.log("MQCLOSE (PubQ) ended with reason " + closeErr.mqrc.toString());
    } else {
      console.log("MQCLOSE (PubQ) successful");
    }
    mq.Disc(hConn, function(discErr) {
      if (discErr) {
        console.log("MQDISC ended with reason " + discErr.mqrc.toString());
      } else {
        console.log("MQDISC successful");
      }
    });
  });
}

// The program really starts here.
// Connect to the queue manager. If that works, the callback function
// opens the topic, and then we can start to retrieve messages.

console.log("Sample AMQSSUB.TS start");

// Get command line parameters
const myArgs = process.argv.slice(2); // Remove redundant parms
if (myArgs[0]) {
  topicString = myArgs[0];
}
if (myArgs[1]) {
  qMgr  = myArgs[1];
}

// Do the connect, including a callback function
mq.Conn(qMgr, function(connErr,hConn) {
   if (connErr) {
     console.log("MQCONN ended with reason code " + connErr.mqrc.toString());
   } else {
     console.log("MQCONN to %s successful ", qMgr);

     // Define what we want to open, and how we want to open it.
     const sd = new mq.MQSD();
     sd.ObjectString = topicString;
     sd.Options =   MQC.MQSO_CREATE
                  | MQC.MQSO_NON_DURABLE
                  | MQC.MQSO_FAIL_IF_QUIESCING
                  | MQC.MQSO_MANAGED;

     mq.Sub(hConn,null,sd,function(subErr,hObjPubQ,hObjSubscription) {
       if (subErr) {
         console.log("MQSUB ended with reason " + subErr.mqrc.toString());
       } else {
         console.log("MQSUB to topic %s successful", topicString);
         // And loop getting messages until done.
         getMessages(hObjPubQ);
       }
       cleanup(hConn,hObjPubQ, hObjSubscription);
     });
   }
});

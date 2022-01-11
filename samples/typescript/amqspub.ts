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
     Andre Asselin - Typescript conversion
*/

/*
 * This is an example of a Node.js program to publish messages to an IBM MQ
 * topic.
 *
 * The topic and queue manager name can be given as parameters on the
 * command line. Defaults are coded in the program.
 *
 * A single message is published, containing a "hello" and timestamp.
 * Each MQI call prints its success or failure.
 *
 */

// Import the MQ package
import * as mq from "ibmmq";
import { MQC } from "ibmmq"; // Want to refer to this export directly for simplicity

// The queue manager and topic to be used. These can be overridden on command line.
// The DEV.BASE.TOPIC object defines a tree starting at dev/
let qMgr = "QM1";
let topicString = "dev/JSTopic";

function formatErr(err: mq.MQError) {
  if (err.mqcc == MQC.MQCC_WARNING)
    return  "MQ call returned warning in " + err.message;
  else
    return  "MQ call failed in " + err.message;
}

// Define some functions that will be used from the main flow
function publishMessage(hObj: mq.MQObject) {
  const msg = "Hello from Node at " + new Date().toString();

  const mqmd = new mq.MQMD(); // Defaults are fine.
  const pmo = new mq.MQPMO();

  // Describe how the Publish (Put) should behave
  pmo.Options = MQC.MQPMO_NO_SYNCPOINT |
                MQC.MQPMO_NEW_MSG_ID |
                MQC.MQPMO_NEW_CORREL_ID;
  // Add in the flag that gives a warning if noone is
  // subscribed to this topic.
  pmo.Options |= MQC.MQPMO_WARN_IF_NO_SUBS_MATCHED;
  mq.Put(hObj,mqmd,pmo,msg,function(err) {
    if (err) {
      console.error(formatErr(err));
    } else {
      console.log("MQPUT successful");
    }
  });
}

// When we're done, close topics and connections
function cleanup(hConn: mq.MQQueueManager, hObj: mq.MQObject) {
  mq.Close(hObj, 0, function(closeErr) {
    if (closeErr) {
      console.error(formatErr(closeErr));
    } else {
      console.log("MQCLOSE successful");
    }
    mq.Disc(hConn, function(discErr) {
      if (discErr) {
        console.error(formatErr(discErr));
      } else {
        console.log("MQDISC successful");
      }
    });
  });
}

// The program really starts here.
// Connect to the queue manager. If that works, the callback function
// opens the topic, and then we can put a message.

console.log("Sample AMQSPUB.TS start");

// Get command line parameters
const myArgs = process.argv.slice(2); // Remove redundant parms
if (myArgs[0]) {
  topicString = myArgs[0];
}
if (myArgs[1]) {
  qMgr  = myArgs[1];
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

mq.Connx(qMgr, cno, function(connErr,hConn) {
   if (connErr) {
     console.error(formatErr(connErr));
   } else {
     console.log("MQCONN to %s successful ", qMgr);

     // Define what we want to open, and how we want to open it.
     //
     // For this sample, we use only the ObjectString, though it is possible
     // to use the ObjectName to refer to a topic Object (ie something
     // that shows up in the DISPLAY TOPIC list) and then that
     // object's TopicStr attribute is used as a prefix to the TopicString
     // value supplied here.
     // Remember that the combined TopicString attribute has to match what
     // the subscriber is using.
     const od = new mq.MQOD();
     od.ObjectString = topicString;
     od.ObjectType = MQC.MQOT_TOPIC;
     const openOptions = MQC.MQOO_OUTPUT;
     mq.Open(hConn,od,openOptions,function(openErr,hObj) {
       if (openErr) {
         console.error(formatErr(openErr));
       } else {
         console.log("MQOPEN of %s successful",topicString);
         publishMessage(hObj);
       }
       cleanup(hConn,hObj);
     });
   }
});

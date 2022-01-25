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
 * This is an example of a Node.js program to set attributes of an IBM MQ
 * object.
 *
 * The queue and queue manager name can be given as a parameter on the
 * command line. Defaults are coded in the program.
 *
 */

// Import the MQ package
import * as mq from "ibmmq";
import { MQC } from "ibmmq"; // Want to refer to this export directly for simplicity

// The queue manager and queue to be used. These can be overridden on command line.
let qMgr = "QM1";
let qName = "DEV.QUEUE.1";

function formatErr(err: mq.MQError) {
  return  "MQ call failed in " + err.message;
}


// When we're done, close queues and connections
function cleanup(hConn: mq.MQQueueManager, hObj: mq.MQObject) {
  mq.Close(hObj, 0, function(closeErr) {
    if (closeErr) {
      console.log(formatErr(closeErr));
    } else {
      console.log("MQCLOSE successful");
    }
    mq.Disc(hConn, function(discErr) {
      if (discErr) {
        console.log(formatErr(discErr));
      } else {
        console.log("MQDISC successful");
      }
    });
  });
}

// This is where the interesting work is done. See MQ Knowledge Center documentation
// about the MQSET verb to understand more about what this is doing, and how the
// parameters work. Using the MQAttr object makes this quite simple.
function setQ(hObj: mq.MQObject) {
   // We will set 3 attributes of the queue.
   const selectors = [new mq.MQAttr(MQC.MQIA_INHIBIT_PUT,MQC.MQQA_PUT_INHIBITED),
                      new mq.MQAttr(MQC.MQIA_INHIBIT_GET,MQC.MQQA_GET_INHIBITED),
                      new mq.MQAttr(MQC.MQCA_TRIGGER_DATA,"TrigData After"),
                     ];


   try {
    mq.Set(hObj,selectors);
    console.log("MQSET of queue successful");
   } catch (err) {
     const mqerr = err as mq.MQError;
     console.log(mqerr.message);
   }
}

// The program really starts here.
// Connect to the queue manager. If that works, the callback function
// opens the queue for SET, and then we can do the real setting.

console.log("Sample AMQSSET.TS start");

// Get command line parameters
const myArgs = process.argv.slice(2); // Remove redundant parms
if (myArgs[0]) {
  qName = myArgs[0];
}
if (myArgs[1]) {
  qMgr  = myArgs[1];
}

const cno = new mq.MQCNO();
cno.Options = MQC.MQCNO_NONE;

mq.Connx(qMgr, cno, function(connErr,hConn) {
   if (connErr) {
     console.log(formatErr(connErr));
   } else {
     console.log("MQCONN to %s successful ", qMgr);

     // Define what we want to open, and how we want to open it.
     const od = new mq.MQOD();
     od.ObjectName = qName;
     od.ObjectType = MQC.MQOT_Q;
     const openOptions = MQC.MQOO_SET;
     mq.Open(hConn,od,openOptions,function(openErr,hObj) {
       if (openErr) {
         console.log(formatErr(openErr));
       } else {
         console.log("MQOPEN of queue successful");
         setQ(hObj);
       }
       cleanup(hConn,hObj);
     });
   }
});

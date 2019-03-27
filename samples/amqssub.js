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
 * This is an example of a Node.js program to subscribe to publications
 * made through IBM MQ.
 *
 * The topic and queue manager name can be given as parameters on the
 * command line. Defaults are coded in the program.
 *
 */

// Import the MQ package
var mq = require('ibmmq');
var MQC = mq.MQC; // Want to refer to this export directly for simplicity

// Import any other packages needed
var StringDecoder = require('string_decoder').StringDecoder;
var decoder = new StringDecoder('utf8');

// The queue manager and queue to be used
var qMgr = "QM1";
var topicString = "dev/JSTopic";

// Global variables
var ok = true;


// Define some functions that will be used from the main flow
function getMessages(hObj) {
  while (ok) {
    getMessage(hObj);
  }
}

// This function retrieves messages from the queue without waiting using
// the synchronous method for simplicity. See amqsgeta for how to use the
// async method.
function getMessage(hObj) {

  var buf = Buffer.alloc(1024);

  var mqmd = new mq.MQMD();
  var gmo = new mq.MQGMO();

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
         console.log("MQGET failed with " + err.mqrc);
       }
       ok = false;
    } else {
      if (mqmd.Format=="MQSTR") {
        console.log("message <%s>", decoder.write(buf.slice(0,len)));
      } else {
        console.log("binary message: " + buf);
      }
    }
  });
}

// When we're done, close queues and connections
function cleanup(hConn,hObjPubQ, hObjSubscription) {
  // Demonstrate two ways of closing queues - first using an exception, then
  // the version with callback.
  try {
    mq.CloseSync(hObjSubscription,0);
    console.log("MQCLOSE (Subscription) successful");
  } catch (err) {
    console.log("MQCLOSE (Subscription) ended with reason "  + err);
  }

  mq.Close(hObjPubQ, 0, function(err) {
    if (err) {
      console.log("MQCLOSE (PubQ) ended with reason " + err.mqrc);
    } else {
      console.log("MQCLOSE (PubQ) successful");
    }
    mq.Disc(hConn, function(err) {
      if (err) {
        console.log("MQDISC ended with reason " + err.mqrc);
      } else {
        console.log("MQDISC successful");
      }
    });
  });
}

// The program really starts here.
// Connect to the queue manager. If that works, the callback function
// opens the topic, and then we can start to retrieve messages.

console.log("Sample AMQSSUB.JS start");

// Get command line parameters
var myArgs = process.argv.slice(2); // Remove redundant parms
if (myArgs[0]) {
  topicString = myArgs[0];
}
if (myArgs[1]) {
  qMgr  = myArgs[1];
}

// Do the connect, including a callback function
mq.Conn(qMgr, function(err,hConn) {
   if (err) {
     console.log("MQCONN ended with reason code " + err.mqrc);
   } else {
     console.log("MQCONN to %s successful ", qMgr);

     // Define what we want to open, and how we want to open it.
     var sd = new mq.MQSD();
     sd.ObjectString = topicString;
     sd.Options =   MQC.MQSO_CREATE
                  | MQC.MQSO_NON_DURABLE
                  | MQC.MQSO_FAIL_IF_QUIESCING
                  | MQC.MQSO_MANAGED;

     mq.Sub(hConn,null,sd,function(err,hObjPubQ,hObjSubscription) {
       if (err) {
         console.log("MQSUB ended with reason " + err.mqrc);
       } else {
         console.log("MQSUB to topic %s successful", topicString);
         // And loop getting messages until done.
         getMessages(hObjPubQ);
       }
       cleanup(hConn,hObjPubQ, hObjSubscription);
     });
   }
});

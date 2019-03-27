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
var mq = require('ibmmq');
var MQC = mq.MQC; // Want to refer to this export directly for simplicity

// The queue manager and topic to be used. These can be overridden on command line.
// The DEV.BASE.TOPIC object defines a tree starting at dev/
var qMgr = "QM1";
var topicString = "dev/JSTopic";

function formatErr(err) {
  if (err.mqcc == MQC.MQCC_WARNING)
    return  "MQ call returned warning in " + err.message;
  else
    return  "MQ call failed in " + err.message;
}

// Define some functions that will be used from the main flow
function publishMessage(hObj) {

  var msg = "Hello from Node at " + new Date();

  var mqmd = new mq.MQMD(); // Defaults are fine.
  var pmo = new mq.MQPMO();

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
function cleanup(hConn,hObj) {
  mq.Close(hObj, 0, function(err) {
    if (err) {
      console.error(formatErr(err));
    } else {
      console.log("MQCLOSE successful");
    }
    mq.Disc(hConn, function(err) {
      if (err) {
        console.error(formatErr(err));
      } else {
        console.log("MQDISC successful");
      }
    });
  });
}

// The program really starts here.
// Connect to the queue manager. If that works, the callback function
// opens the topic, and then we can put a message.

console.log("Sample AMQSPUB.JS start");

// Get command line parameters
var myArgs = process.argv.slice(2); // Remove redundant parms
if (myArgs[0]) {
  topicString = myArgs[0];
}
if (myArgs[1]) {
  qMgr  = myArgs[1];
}

var cno = new mq.MQCNO();
cno.Options = MQC.MQCNO_NONE; // use MQCNO_CLIENT_BINDING to connect as client

// To add authentication, enable this block
if (false) {
  var csp = new mq.MQCSP();
  csp.UserId = "metaylor";
  csp.Password = "passw0rd";
  cno.SecurityParms = csp;
}

mq.Connx(qMgr, cno, function(err,hConn) {
   if (err) {
     console.error(formatErr(err));
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
     var od = new mq.MQOD();
     od.ObjectString = topicString;
     od.ObjectType = MQC.MQOT_TOPIC;
     var openOptions = MQC.MQOO_OUTPUT;
     mq.Open(hConn,od,openOptions,function(err,hObj) {
       if (err) {
         console.error(formatErr(err));
       } else {
         console.log("MQOPEN of %s successful",topicString);
         publishMessage(hObj);
       }
       cleanup(hConn,hObj);
     });
   }
});

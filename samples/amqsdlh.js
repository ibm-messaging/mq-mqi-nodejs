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
 * This is an example of a Node.js program to show how to use the Dead Letter
 * Header methods in an MQ program
 *
 * The queue and queue manager name can be given as parameters on the
 * command line. Defaults are coded in the program.
 *
 * A single message is put, containing a "hello" and timestamp. It is preceded
 * by a DLH structure as would normally be done when an application cannot
 * process a received message. The message is then retrieved and printed.
 *
 * Each MQI call prints its success or failure.
 *
 */

// Import the MQ package
var mq = require('ibmmq');
var MQC = mq.MQC; // Want to refer to this export directly for simplicity

// Import any other packages needed
var StringDecoder = require('string_decoder').StringDecoder;
var decoder = new StringDecoder('utf8');

// The queue manager and queue to be used. These can be overridden on command line.
var qMgr = "QM1";
var qName = "DEV.QUEUE.1";

function formatErr(err) {
  return  "MQ call failed in " + err.message;
}

function toHexString(byteArray) {
  return byteArray.reduce((output, elem) =>
    (output + ('0' + elem.toString(16)).slice(-2)),
    '');
}

// Define some functions that will be used from the main flow
function putMessage(hObj) {

  var msg = "Hello from Node at " + new Date();

  var mqmd = new mq.MQMD(); // Defaults are fine.
  var pmo = new mq.MQPMO();

  // Describe how the Put should behave
  pmo.Options = MQC.MQPMO_NO_SYNCPOINT |
                MQC.MQPMO_NEW_MSG_ID |
                MQC.MQPMO_NEW_CORREL_ID;

  // Don't normally need to set this for text messages, but as we're not
  // putting a retrieved message to the DLQ (instead creating the msg from
  // scratch) then we need to say up front what type it is.
  mqmd.Format = MQC.MQFMT_STRING;

  // Create a DLH and allow it to modify MQMD chaining fields like the CCSID
  var mqdlh = new mq.MQDLH(mqmd);

  // Fill in something for why the message is put to the DLQ
  mqdlh.Reason = MQC.MQRC_NOT_AUTHORIZED;
  mqdlh.DestQName = "DEST.QUEUE";
  mqdlh.DestQMgrName = "DEST.QMGR";

  // Create the full message by concatenating buffers into a single block
  var fullMsg = Buffer.concat([mqdlh.getBuffer(),Buffer.from(msg)]);

  // And put the message
  mq.Put(hObj,mqmd,pmo,fullMsg,function(err) {
    if (err) {
      console.log(formatErr(err));
    } else {
      console.log("MQPUT successful");
    }
  });
}


// This function retrieves messages from the queue without waiting.
// Will just use a synchronous Get for simplicity in the flow as it's
// not what we're demonstrating in this sample.
function getMessage(hObj) {

  var buf = Buffer.alloc(1024);

  var mqmd = new mq.MQMD();
  var gmo = new mq.MQGMO();

  gmo.Options = MQC.MQGMO_NO_SYNCPOINT |
                MQC.MQGMO_NO_WAIT |
                MQC.MQGMO_CONVERT |
                MQC.MQGMO_FAIL_IF_QUIESCING;

  try {
    var len = mq.GetSync(hObj,mqmd,gmo,buf);
    var format = mqmd.Format;

    // If the message has a DLH then
    // parse and print it.
    if (format == MQC.MQFMT_DEAD_LETTER_HEADER) {
      var hdr = mq.MQDLH.getHeader(buf);
      console.log("HDR is %j",hdr);
      printMessage(hdr.Format,buf.slice(hdr.StrucLength),len-hdr.StrucLength);
    } else {
      printMessage(format,buf,len);
    }
  } catch (err) {
    if (err.mqrc == MQC.MQRC_NO_MSG_AVAILABLE) {
      console.log("no more messages");
    } else {
      console.log(formatErr(err));
    }
  }
}


function printMessage(format,buf,len) {
  if (format=="MQSTR") {
    console.log("message len=%d <%s>", len,decoder.write(buf.slice(0,len)));
  } else {
    console.log("binary message: " + buf);
  }
}

// When we're done, close queues and connections
function cleanup(hConn,hObj) {
  mq.Close(hObj, 0, function(err) {
    if (err) {
      console.log(formatErr(err));
    } else {
      //console.log("MQCLOSE successful");
    }
    mq.Disc(hConn, function(err) {
      if (err) {
        console.log(formatErr(err));
      } else {
        //console.log("MQDISC successful");
      }
    });
  });
}

// The program really starts here.
// Connect to the queue manager. If that works, the callback function
// opens the queue, and then we can put a message.

console.log("Sample AMQSDLH.JS start");

// Get command line parameters
var myArgs = process.argv.slice(2); // Remove redundant parms
if (myArgs[0]) {
  qName = myArgs[0];
}
if (myArgs[1]) {
  qMgr  = myArgs[1];
}

var cno = new mq.MQCNO();
cno.Options = MQC.MQCNO_NONE; // use MQCNO_CLIENT_BINDING to connect as client

mq.Connx(qMgr, cno, function(err,hConn) {
   if (err) {
     console.log(formatErr(err));
   } else {
     console.log("MQCONN to %s successful ", qMgr);

     // Define what we want to open, and how we want to open it.
     var od = new mq.MQOD();
     od.ObjectName = qName;
     od.ObjectType = MQC.MQOT_Q;
     var openOptions = MQC.MQOO_OUTPUT | MQC.MQOO_INPUT_AS_Q_DEF;
     mq.Open(hConn,od,openOptions,function(err,hObj) {
       if (err) {
         console.log(formatErr(err));
       } else {
         console.log("MQOPEN of %s successful",qName);
         // Assume queue is empty when we start
         putMessage(hObj);  // Put an initial message
         getMessage(hObj);  // And get it back
       }
       cleanup(hConn,hObj);
     });
   }
});

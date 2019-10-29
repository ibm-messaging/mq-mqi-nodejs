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
 * This is an example of a Node.js program to get messages from an IBM MQ
 * queue.
 *
 * The queue and queue manager name can be given as parameters on the
 * command line. Defaults are coded in the program.
 *
 * Each MQI call prints its success or failure.
 */

// Import the MQ package
var mq = require('ibmmq');
var MQC = mq.MQC; // Want to refer to this export directly for simplicity

// Import any other packages needed
var StringDecoder = require('string_decoder').StringDecoder;
var decoder = new StringDecoder('utf8');

// The default queue manager and queue to be used
var qMgr = "QM1";
var qName = "DEV.QUEUE.1";

// Global variables
var ok = true;

function formatErr(err) {
  return  "MQ call failed in " + err.message;
}

// Define some functions that will be used from the main flow
function getMessages(hObj) {
  while (ok) {
    getMessage(hObj);
  }
}

// This function retrieves messages from the queue without waiting.
function getMessage(hObj) {

  var buf = Buffer.alloc(1024);
  var hdr;
  var mqmd = new mq.MQMD();
  var gmo = new mq.MQGMO();

  gmo.Options = MQC.MQGMO_NO_SYNCPOINT |
                MQC.MQGMO_NO_WAIT |
                MQC.MQGMO_CONVERT |
                MQC.MQGMO_FAIL_IF_QUIESCING;


  mq.GetSync(hObj,mqmd,gmo,buf,function(err,len) {
    if (err) {
       if (err.mqrc == MQC.MQRC_NO_MSG_AVAILABLE) {
         console.log("no more messages");
       } else {
         console.log(formatErr(err));
       }
       ok = false;
    } else {
      var format = mqmd.Format;
      switch (format) {
      case MQC.MQFMT_RF_HEADER_2:
        hdr   = mq.MQRFH2.getHeader(buf);
        var props = mq.MQRFH2.getProperties(hdr,buf);
        console.log("RFH2 HDR is %j",hdr);
        console.log("Properties are '%s'",props);
        printBody(hdr.Format,buf.slice(hdr.StrucLength),len-hdr.StrucLength);
        break;
      case MQC.MQFMT_DEAD_LETTER_HEADER:
        hdr = mq.MQDLH.getHeader(buf);
        console.log("DLH HDR is %j",hdr);
        printBody(hdr.Format,buf.slice(hdr.StrucLength),len-hdr.StrucLength);
        break;
      default:
        printBody(format,buf,len);
        break;
      }
    }
  });
}

function printBody(format,buf,len) {
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
      console.log("MQCLOSE successful");
    }
    mq.Disc(hConn, function(err) {
      if (err) {
        console.log(formatErr(err));
      } else {
        console.log("MQDISC successful");
      }
    });
  });
}

// The program really starts here.
// Connect to the queue manager. If that works, the callback function
// opens the queue, and then we can start to retrieve messages.

console.log("Sample AMQSGET.JS start");

// Get command line parameters
var myArgs = process.argv.slice(2); // Remove redundant parms
if (myArgs[0]) {
  qName = myArgs[0];
}
if (myArgs[1]) {
  qMgr  = myArgs[1];
}


// Do the connect, including a callback function
mq.Conn(qMgr, function(err,hConn) {
   if (err) {
      console.log(formatErr(err));
   } else {
     console.log("MQCONN to %s successful ", qMgr);

     // Define what we want to open, and how we want to open it.
     var od = new mq.MQOD();
     od.ObjectName = qName;
     od.ObjectType = MQC.MQOT_Q;
     var openOptions = MQC.MQOO_INPUT_AS_Q_DEF;
     mq.Open(hConn,od,openOptions,function(err,hObj) {
       if (err) {
         console.log(formatErr(err));
       } else {
         console.log("MQOPEN of %s successful",qName);
         // And loop getting messages until done.
         getMessages(hObj);
       }
       cleanup(hConn,hObj);
     });
   }
});

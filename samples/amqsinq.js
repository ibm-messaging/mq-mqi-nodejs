'use strict';
/*
  Copyright (c) IBM Corporation 2017

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific

   Contributors:
     Mark Taylor - Initial Contribution
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
var mq = require('ibmmq');
var MQC = mq.MQC; // Want to refer to this export directly for simplicity

// The queue manager and queue to be used. These can be overridden on command line.
var qMgr = "QM1";
var qName = "SYSTEM.DEFAULT.LOCAL.QUEUE";

function formatErr(err) {
  return  "MQ call failed in " + err.message;
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

function inqQmgr(hObj) {
   // We will request 3 attributes of the queue manager.
   var selectors = [MQC.MQCA_Q_MGR_NAME,
                    MQC.MQCA_DEAD_LETTER_Q_NAME,
                    MQC.MQIA_CODED_CHAR_SET_ID];
   var intAttrs = []; // Allocate an array which will get filled in int values 
   var charAttrs = Buffer.alloc(96); // Allocate a buffer filled in with char values

   try {
    mq.Inq(hObj,selectors,intAttrs,charAttrs);

    // We have to know how long each character attribute is, and therefore where to 
    // extract the values from. They are in the same order as the MQCA attributes supplied
    // in the request.
    var qmgrName = charAttrs.slice(0,48);
    var dlqName = charAttrs = charAttrs.slice(48,96);

    console.log("ccsid=%d qmgrName = \"%s\", dlqName = \"%s\"",intAttrs[0],qmgrName,dlqName);

   } catch (err) {
     console.log(err.message);
   }
}

// The program really starts here.
// Connect to the queue manager. If that works, the callback function
// opens the queue, and then we can put a message.

console.log("Sample AMQSINQ.JS start");

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
     // In this case, we want to INQUIRE on attributes of the queue manager so we
     // get an object handle that refers to that qmgr.
     // No ObjectName is needed for this inquiry - the fact that it is the Q_MGR type
     // is sufficient.
     var od = new mq.MQOD();
     od.ObjectName = null;   
     od.ObjectType = MQC.MQOT_Q_MGR;
     var openOptions = MQC.MQOO_INQUIRE;
     mq.Open(hConn,od,openOptions,function(err,hObj) {
       if (err) {
         console.log(formatErr(err));
       } else {
         console.log("MQOPEN of %s successful",qName);
         inqQmgr(hObj);
       }
       cleanup(hConn,hObj);
     });
   }
});

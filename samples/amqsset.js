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
 * This is an example of a Node.js program to inquire about the attributes of an IBM MQ
 * object.
 *
 * The queue manager name can be given as a parameter on the
 * command line. Defaults are coded in the program.
 *
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

// This is where the interesting work is done. See MQ Knowledge Center documentation
// about the MQSET verb to understand more about what this is doing, and how the
// parameters work.
function setQ(hObj) {
   // We will set 3 attributes of the queue.
   var selectors = [MQC.MQIA_INHIBIT_PUT,
                    MQC.MQIA_INHIBIT_GET,
                    MQC.MQCA_TRIGGER_DATA];

   // Allocate an array which holds the integer values
   var intAttrs = [MQC.MQQA_PUT_INHIBITED,MQC.MQQA_GET_INHIBITED];

   // Allocate a char buffer to hold the value for this setting. This is an
   // easy way to ensure it's long enough, and padded appropriately (0 rather than space is OK)
   var charAttrs = Buffer.from("TrigData After");
   var padding = Buffer.alloc(MQC.MQ_TRIGGER_DATA_LENGTH);
   charAttrs = Buffer.concat([charAttrs,padding],MQC.MQ_TRIGGER_DATA_LENGTH);

   try {
    mq.Set(hObj,selectors,intAttrs,charAttrs);

   } catch (err) {
     console.log(err.message);
   }
}

// The program really starts here.
// Connect to the queue manager. If that works, the callback function
// opens the queue for SET, and then we can do the real setting.

console.log("Sample AMQSSET.JS start");

// Get command line parameters
var myArgs = process.argv.slice(2); // Remove redundant parms
if (myArgs[0]) {
  qName = myArgs[0];
}
if (myArgs[1]) {
  qMgr  = myArgs[1];
}

var cno = new mq.MQCNO();
cno.Options = MQC.MQCNO_NONE;

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
     od.ObjectName = qName;
     od.ObjectType = MQC.MQOT_Q;
     var openOptions = MQC.MQOO_SET;
     mq.Open(hConn,od,openOptions,function(err,hObj) {
       if (err) {
         console.log(formatErr(err));
       } else {
         console.log("MQOPEN of queue manager successful");
         setQ(hObj);
       }
       cleanup(hConn,hObj);
     });
   }
});

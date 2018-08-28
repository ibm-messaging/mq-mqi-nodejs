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
  See the License for the specific language governing permissions and
  limitations under the License.

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

// The queue manager to be used. This can be overridden on command line.
var qMgr = "QM1";

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
// about the MQINQ verb to understand more about what this is doing, and how the
// parameters work.
function inqQmgr(hObj) {
   // We will request 3 attributes of the queue manager.
   var selectors = [new mq.MQAttr(MQC.MQCA_Q_MGR_NAME),
                    new mq.MQAttr(MQC.MQCA_DEAD_LETTER_Q_NAME),
                    new mq.MQAttr(MQC.MQIA_CODED_CHAR_SET_ID)
                   ];

   try {
    mq.Inq(hObj,selectors);

    console.log("ccsid=%d qmgrName = \"%s\", dlqName = \"%s\"",selectors[2].value,selectors[0].value,selectors[1].value);


   } catch (err) {
     console.log(err.message);
   }
}

// The program really starts here.
// Connect to the queue manager. If that works, the callback function
// opens the queue manager for inquiry, and then we can do the real query.

console.log("Sample AMQSINQ.JS start");

// Get command line parameters
var myArgs = process.argv.slice(2); // Remove redundant parms
if (myArgs[0]) {
  qMgr  = myArgs[0];
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
     od.ObjectName = null;
     od.ObjectType = MQC.MQOT_Q_MGR;
     var openOptions = MQC.MQOO_INQUIRE;
     mq.Open(hConn,od,openOptions,function(err,hObj) {
       if (err) {
         console.log(formatErr(err));
       } else {
         console.log("MQOPEN of queue manager successful");
         inqQmgr(hObj);
       }
       cleanup(hConn,hObj);
     });
   }
});

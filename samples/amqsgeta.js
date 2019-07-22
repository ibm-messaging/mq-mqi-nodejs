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
 * This is an example of a Node.js program to get messages from an IBM MQ
 * queue using an asynchronous method.
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
var msgId = null;

// Some global variables
var connectionHandle;
var queueHandle;

var waitInterval = 3; // max seconds to wait for a new message
var ok = true;
var exitCode = 0;

/*
 * Format any error messages
 */
function formatErr(err) {
  if (err) {
    ok = false;
    return "MQ call failed at " + err.message;
  } else {
    return "MQ call successful";
  }
}

function hexToBytes(hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
}


/*
 * Define which messages we want to get, and how.
 */
function getMessages() {
  var md = new mq.MQMD();
  var gmo = new mq.MQGMO();

  gmo.Options = MQC.MQGMO_NO_SYNCPOINT |
                MQC.MQGMO_WAIT |
                MQC.MQGMO_CONVERT |
                MQC.MQGMO_FAIL_IF_QUIESCING;
  gmo.MatchOptions = MQC.MQMO_NONE;
  gmo.WaitInterval = waitInterval * 1000; // 3 seconds

  if (msgId != null) {
     console.log("Setting Match Option for MsgId");
     gmo.MatchOptions = MQC.MQMO_MATCH_MSG_ID;
     md.MsgId = hexToBytes(msgId);
  }

  // Set up the callback handler to be invoked when there
  // are any incoming messages. As this is a sample, I'm going
  // to tune down the poll interval from default 10 seconds to 0.5s.
  mq.setTuningParameters({getLoopPollTimeMs: 500});
  mq.Get(queueHandle,md,gmo,getCB);

}

/*
 * This function is the async callback. Parameters
 * include the message descriptor and the buffer containing
 * the message data.
 */
function getCB(err, hObj, gmo,md,buf, hConn ) {
   // If there is an error, prepare to exit by setting the ok flag to false.
   if (err) {
     if (err.mqrc == MQC.MQRC_NO_MSG_AVAILABLE) {
       console.log("No more messages available.");
     } else {
       console.log(formatErr(err));
       exitCode = 1;
     }
     ok = false;
     // We don't need any more messages delivered, so cause the
     // callback to be deleted after this one has completed.
     mq.GetDone(hObj);
   } else {
     if (md.Format=="MQSTR") {
       console.log("message <%s>", decoder.write(buf));
     } else {
       console.log("binary message: " + buf);
     }
  }
}

/*
 * When we're done, close any queues and connections.
 */
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

/**************************************************************
 * The program really starts here.
 * Connect to the queue manager. If that works, the callback function
 * opens the queue, and then we can start to retrieve messages.
 */
console.log("Sample AMQSGETA.JS start");

// Get command line parameters
var myArgs = process.argv.slice(2); // Remove redundant parms
if (myArgs[0]) {
  qName = myArgs[0];
}
if (myArgs[1]) {
  qMgr  = myArgs[1];
}
if (myArgs[2]) {
  msgId  = myArgs[2];
}

mq.setTuningParameters({syncMQICompat:true});


// Connect to the queue manager, including a callback function for
// when it completes.
mq.Conn(qMgr, function(err,hConn) {
   if (err) {
     console.log(formatErr(err));
     ok = false;
   } else {
     console.log("MQCONN to %s successful ", qMgr);
     connectionHandle = hConn;

     // Define what we want to open, and how we want to open it.
     var od = new mq.MQOD();
     od.ObjectName = qName;
     od.ObjectType = MQC.MQOT_Q;
     var openOptions = MQC.MQOO_INPUT_AS_Q_DEF;
     mq.Open(hConn,od,openOptions,function(err,hObj) {
       queueHandle = hObj;
       if (err) {
         console.log(formatErr(err));
       } else {
         console.log("MQOPEN of %s successful",qName);
         // And now we can ask for the messages to be delivered.
         getMessages();
       }
     });
   }
});

// We need to keep the program active so that the callbacks from the
// message handler are processed. This is one way to do it. Use the
// defined waitInterval with a bit extra added and look for the
// current status. If not OK, then close everything down cleanly.
setInterval(function() {
  if (!ok) {
     console.log("Exiting ...");
     cleanup(connectionHandle,queueHandle);
     process.exit(exitCode);
  }
}, (waitInterval + 2 ) * 1000);

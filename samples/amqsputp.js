'use strict';
/*
  Copyright (c) IBM Corporation 2017, 2020

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
 * This is an example of a Node.js program to put messages to an IBM MQ
 * queue. It shows how you can use Promises instead of callbacks for
 * processing the major MQI verbs.
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
var qName = "DEV.QUEUE.1";

var ghObj;
var ghConn;

function formatErr(err) {
  return  "MQ call failed in " + err.message;
}

// When we're done, close queues and connections
function cleanup(hConn,hObj) {
  mq.Close(hObj, 0, function(err) {
    if (err) {
      console.log("Cleanup: ", formatErr(err));
    } else {
      console.log("MQCLOSE successful");
    }
    mq.Disc(hConn, function(err) {
      if (err) {
        console.log("Cleanup: " ,formatErr(err));
      } else {
        console.log("MQDISC successful");
      }
    });
  });
}


// The program really starts here.
// Connect to the queue manager. If that works, the callback function
// opens the queue, and then we can put a message.

console.log("Sample AMQSPUTP.JS start");

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

// To add authentication, enable this block
if (false) {
  var csp = new mq.MQCSP();
  csp.UserId = "metaylor";
  csp.Password = "passw0rd";
  cno.SecurityParms = csp;
}

// The Promise versions of the verbs make it easy to chain
// the operations without getting buried in nested callbacks.
// Note that some of the Promises do not return any parameters
// on success.
mq.ConnxPromise(qMgr, cno)
.then(hConn=>{
      console.log("MQCONN to %s successful ", qMgr);
      ghConn = hConn;
      var od = new mq.MQOD();
      od.ObjectName = qName;
      od.ObjectType = MQC.MQOT_Q;
      var openOptions = MQC.MQOO_OUTPUT;
      return mq.OpenPromise(hConn,od,openOptions);
      })
.then(hObj=> {
      console.log("MQOPEN of %s successful",qName);
      var msg = "Hello from Node at " + new Date();

      var mqmd = new mq.MQMD(); // Defaults are fine.
      var pmo = new mq.MQPMO();
      // Describe how the Put should behave
      pmo.Options = MQC.MQPMO_NO_SYNCPOINT |
                    MQC.MQPMO_NEW_MSG_ID |
                    MQC.MQPMO_NEW_CORREL_ID;

      ghObj = hObj;
      return mq.PutPromise(hObj,mqmd,pmo,msg);
      })
.then(() => {
      console.log("MQPUT successful");
      return mq.ClosePromise(ghObj,0);
      })
.then(() => {
      console.log("MQCLOSE successful");
      return mq.DiscPromise(ghConn);
      })
.then(() => {console.log("Done.");})
.catch(err=>{
      console.log(formatErr(err));
      cleanup(ghConn,ghObj);
      });

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
 * This is an example of a Node.js program to connect as a client to an 
 * IBM MQ queue manager.
 *
 * The queue manager name and channel attributes such as CONNAME are hardcoded
 * to demonstrate how to use them.
 *
 * This program also demonstrates how authentication can be achieved with
 * a userid/password option
 */

// Import the MQ package
var mq = require('ibmmq');
var MQC = mq.MQC; // Want to refer to this export directly for simplicity

// The queue manager and queue to be used. These can be overridden on command line.
var qMgr = "QM1";
var hConn;

function formatErr(err) {
  return  "MQ call failed in " + err.message;
}


// When we're done, close queues and connections
function cleanup(hConn) {
  mq.Disc(hConn, function(err) {
    if (err) {
      console.log(formatErr(err));
    } else {
      console.log("MQDISC successful");
    }
  });
}

// The program really starts here.
// Connect to the queue manager. If that works, the callback function
// opens the queue, and then we can put a message.

console.log("Sample AMQSCONN.JS start");

var cno = new mq.MQCNO();

// This block adds authentication
var csp = new mq.MQCSP();
csp.UserId = "metaylor";
csp.Password = "passw0rd";
// Uncomment next line to use the userid/password
//cno.SecurityParms = csp;

// And this block uses the MQCD to programatically connect as a client
cno.Options = MQC.MQCNO_CLIENT_BINDING;
var cd = new mq.MQCD();
cd.ConnectionName = "localhost(1414)";
cd.ChannelName = "SYSTEM.DEF.SVRCONN";
cno.ClientConn = cd;

mq.Connx(qMgr, cno, function(err,conn) {
  if (err) {
    console.log(formatErr(err));
  } else {
    console.log("MQCONN to %s successful ", qMgr);
    hConn = conn;
    cleanup(hConn);
  }
});

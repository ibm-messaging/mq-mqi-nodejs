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
 * This is an example of a Node.js program to use message
 * properties.
 *
 * The queue and queue manager name can be given as parameters on the
 * command line. Defaults are coded in the program.
 *
 * A single message is put with some properties set on it. The message
 * is then retrieved, and the properties displayed. The queue ought to be
 * empty before starting to run this program, to ensure the same message is
 * retrieved as we put.
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

var hConn;

// Global variables
var ok = true;
var propsToRead = true;

function formatErr(err) {
  return  "MQ call failed in " + err.message;
}

/* This is where the message has properties set on it before being put
 * to the queue. First we have to create a message handle, then use
 * that handle to set the properties. Then the handle is set as one
 * of the MQPMO structure fields as the message is put to the queue.
 * Once we're done, the message handle is deleted.
 */
function putMessage(hConn,hObj) {

  var msg = "Hello from Node at " + new Date();

  var mqmd = new mq.MQMD(); // Defaults are fine.
  var pmo = new mq.MQPMO();
  var cmho = new mq.MQCMHO();

  mq.CrtMh(hConn, cmho,function(err,mh) {
    if (err) {
      console.log(formatErr(err));
    } else {
      var smpo = new mq.MQSMPO();
      var pd  = new mq.MQPD();

      // Note how the "value" of each property can change datatype
      // without needing to be explicitly stated.
      var name="PROP1STRING";
      var value="helloStringProperty";
      mq.SetMp(hConn,mh,smpo,name,pd,value);

      name="PROP2INT";
      value=42;
      mq.SetMp(hConn,mh,smpo,name,pd,value);

      name="PROP3BOOL";
      mq.SetMp(hConn,mh,smpo,name,pd,true);

      name="PROP4BYTEARRAY";
      value=Buffer.alloc(6);
      for (var i=0;i<6;i++) {
        value[i] = 0x64 + i;
      }
      mq.SetMp(hConn,mh,smpo,name,pd,value);

      name="PROP5NULL";
      mq.SetMp(hConn,mh,smpo,name,pd);
    }

    // Describe how the Put should behave and put the message
    pmo.Options = MQC.MQPMO_NO_SYNCPOINT |
                  MQC.MQPMO_NEW_MSG_ID |
                  MQC.MQPMO_NEW_CORREL_ID;

    // Make sure the message handle is used during the Put
    pmo.OriginalMsgHandle = mh;

    mq.Put(hObj,mqmd,pmo,msg,function(err) {
      if (err) {
        console.log(formatErr(err));
      } else {
        console.log("MQPUT successful");
      }
    });

    // And finally in this phase, delete the message handle
    var dmho = new mq.MQDMHO();
    mq.DltMh(hConn,mh,dmho, function(err){
      if (err) {
        console.log(formatErr(err));
      } else {
        console.log("MQDLTMH successful");
      }
    });
  });
}

/* Print the returned property */
function printProperty(err,name,value,len,type) {
  if (err) {
    if (err.mqrc == MQC.MQRC_PROPERTY_NOT_AVAILABLE) {
      console.log("No more properties");
    } else {
      console.log(formatErr(err));
    }
    propsToRead = false;
  } else {
    console.log("Property name  : %s",name);
    if (type != MQC.MQTYPE_BYTE_STRING) {
      console.log("         value : " + value);
    } else {
      var ba = "[";
      for (var i=0;i<len;i++) {
         ba += " " + value[i];
      }
      ba += " ]";
      console.log("         value : " + ba);
    }
  }
}

/* This function retrieves messages from the queue. As we are more interested
 * in the message property processing here, we'll just use the synchronous
 * GetSync() verb.
 *
 * A message handle is created, and then used during the Get() operation as
 * part of the MQGMO structure. We then iterate over the properties that
 * are referenced via the handle.
 */
function getMessage(hConn,hObj) {

  var buf = Buffer.alloc(1024);
  var propBuf = Buffer.alloc(1024);
  var cmho = new mq.MQCMHO();
  var dmho = new mq.MQDMHO();

  mq.CrtMh(hConn, cmho,function(err,mh) {
    if (err) {
      console.log(formatErr(err));
    } else {
      console.log("MQCRTMH successful");

      var mqmd = new mq.MQMD();
      var gmo = new mq.MQGMO();

      // Say that we want the properties to be returned via a
      // handle (as opposed to being in the message body with an RFH2
      // structure, or being ignored).
      gmo.Options = MQC.MQGMO_NO_SYNCPOINT |
                    MQC.MQGMO_NO_WAIT |
                    MQC.MQGMO_CONVERT |
                    MQC.MQGMO_PROPERTIES_IN_HANDLE |
                    MQC.MQGMO_FAIL_IF_QUIESCING;

      // And set the handle that we want to use.
      gmo.MsgHandle = mh;

      // Get the message.
      mq.GetSync(hObj,mqmd,gmo,buf,function(err,len) {
        if (err) {
           if (err.mqrc == MQC.MQRC_NO_MSG_AVAILABLE) {
             console.log("no more messages");
           } else {
             console.log(formatErr(err));
           }
           ok = false;
        } else {
          var impo = new mq.MQIMPO();
          var pd  = new mq.MQPD();

          impo.Options =  MQC.MQIMPO_CONVERT_VALUE | MQC.MQIMPO_INQ_FIRST;
          propsToRead = true;

          while (propsToRead) {
            // Use "%" as a wildcard to get all properties
            mq.InqMp(hConn,mh,impo,pd, "%", propBuf, printProperty);
            impo.Options =  MQC.MQIMPO_CONVERT_VALUE | MQC.MQIMPO_INQ_NEXT;
          }

          // Print the message body
          if (mqmd.Format=="MQSTR") {
            console.log("message <%s>", decoder.write(buf.slice(0,len)));
          } else {
            console.log("binary message: " + buf);
          }
        }
      });
      // Finally in this phase, delete the message handle
      mq.DltMh(hConn,mh,dmho, function(err){
        if (err) {
          console.log(formatErr(err));
        } else {
          console.log("MQDLTMH successful");
        }
      });
    }
  });
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
// opens the queue, and then we can put a message.

console.log("Sample AMQSPROP.JS start");

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
     var od = new mq.MQOD();
     od.ObjectName = qName;
     od.ObjectType = MQC.MQOT_Q;
     var openOptions = MQC.MQOO_OUTPUT | MQC.MQOO_INPUT_AS_Q_DEF;
     mq.Open(hConn,od,openOptions,function(err,hObj) {
       if (err) {
         console.log(formatErr(err));
       } else {
         console.log("MQOPEN of %s successful",qName);
         putMessage(hConn,hObj);
         getMessage(hConn,hObj);
       }
       cleanup(hConn,hObj);
     });
   }
});

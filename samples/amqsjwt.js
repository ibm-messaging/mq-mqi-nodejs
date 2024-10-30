"use strict";
/*
  Copyright (c) IBM Corporation 2023

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
This is a short sample to show how to connect to a remote
queue manager in a Node.js program by using a JWT token.

The sample makes an API call to the Token Server to authenticate a user,
and uses the returned token to connect to the queue manager which must have been
configured to recognise tokens.

There is no attempt in this sample to configure advanced security features
such as TLS for the queue manager connection. It does, however, use a minimal
TLS connection to the Token Server.

Defaults are provided for all parameters. Use "-?" to see the options.

If an error occurs, the error is reported.
*/

// Import the MQ package
const mq = require("ibmmq");
const MQC = mq.MQC; // Want to refer to this export directly for simplicity

// Import the https package for connection to the Token Server
const https = require("https");
const querystring = require("querystring");

// Options from the command line parameters with defaults set here
const cf = {
  qMgrName:       "QM1",
  connectionName: "localhost(1414)",
  channel       : "SYSTEM.DEF.SVRCONN",
  tokenHost     : "localhost",
  tokenPort     : 8443,
  tokenUserName : "jwtuser",
  tokenPassword : "passw0rd",
  tokenClientId : "jwtcid",
  tokenRealm    : "mq",
};

function formatErr(err) {
  return  "MQ call failed in " + err.message;
}

function cleanup(err) {
  console.error(err);
  process.exit(1);
}

function sleep(ms) {
  return new Promise(resolve=>{
    setTimeout(resolve,ms);
  });
}

// Usage for command line options
function printSyntax() {
  const usage =
`Usage for amqsjwt:
  -channel string
        MQ Channel Name (default "SYSTEM.DEF.SVRCONN")
  -clientId string
        ClientId (default "jwtcid")
  -connection string
        MQ Connection Name (default "localhost(1414)")
  -host string
      hostname for Token Server (default "localhost")
  -port string
      portnumber for Token Server (default 8443)
  -m string
        Queue Manager (default "QM1")
  -password string
        Password (default "passw0rd")
  -realm string
        Realm (default "mq")
  -user string
        UserName (default "jwtuser")
`;
  console.log(usage);
  process.exit(1);
}

// Parse the argument list. Don't try anything too fancy.
function parseArgs() {
  try {
  // Skip "node amqsjwt" argv from the start of the line
  for (let i=2;i<process.argv.length;i++) {
    switch (process.argv[i]) {
    case "-m":
      cf.qMgrName = process.argv[++i];
      break;
    case "-connection":
      cf.connectionName = process.argv[++i];
      break;
    case "-channel":
      cf.channel = process.argv[++i];
      break;
    case "-user":
      cf.tokenUserName = process.argv[++i];
      break;
    case "-password":
      cf.tokenPassword = process.argv[++i];
      break;
    case "-realm":
      cf.tokenRealm = process.argv[++i];
      break;
    case "-clientId":
      cf.tokenClientId = process.argv[++i];
      break;
    case "-host":
      cf.tokenHost = process.argv[++i];
      break;
    case "-port":
      cf.tokenPort = process.argv[++i];
      break;
    default:
      console.error("Unrecognised parameter: ",process.argv[i]);
      printSyntax();
    }
  }
  } catch {
    printSyntax();
  }
}

/* The core of the sample. It will call the Token Server with an HTTPS POST.
 * Then the passed callback function does the MQCONN using the returned token
 */
function obtainToken(connectCb) {
  /*
   * Build the string that is passed as form data to the server
   */
  const formData = querystring.stringify({
                username:   cf.tokenUserName,
                password:   cf.tokenPassword,
                client_id:  cf.tokenClientId,
                grant_type: "password",
  });

  /*
   * NOTE 1: The use of "rejectUnauthorized" is not a good idea for production, but it means
   * we don't need to set up a truststore for the server's certificate. We will simply trust
   * it - useful if it's a development-level server with a self-signed cert.
   * NOTE 2: If you do choose to set up a truststore/keystore for the connection to the token server,
   * then they must be in a suitable format for OpenSSL (such as pem, p12), not the kdb format usually
   * used for an MQ connection.
   */
  const options = {
    hostname: cf.tokenHost,
    port: cf.tokenPort,
    rejectUnauthorized: false,
    // The "path" element works for the Token Server on my machine; other servers might
    // have a slightly different structure.
    path: "/realms/" + cf.tokenRealm + "/protocol/openid-connect/token",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": formData.length,
    },
  };

  /*
   * Make the call to the server and build up the response
   */
  const req = https.request(options,  (res) => {
    let result = "";

    res.on("data", (chunk) => {
      result += chunk;
    });

    res.on("end", () =>{
      // The returned JSON has a number of fields; "access_token" is the one
      // we care about.
      const j = JSON.parse(result);

      // We've now successfully completed the POST call so can
      // call MQCONNX to check that the token really worked
      connectCb(j.access_token);
    });

    res.on("error", (err) => {
      cleanup(err);
    });
  });

  req.on("error", (err) => {
    cleanup(err);
  });

  // This is where the form data is sent to the server
  req.write(formData);
  req.end();

}

/*
 * This function is driven as a callback once the token has been retrieved from the server
 */
function connect(token) {

  if (token == null) {
    cleanup("Could not obtain token");
  }

  console.log("Using token: %s",token);

  // Create default MQCNO structure
  const cno = new mq.MQCNO();

  // Add authentication via the MQCSP structure
  const csp = new mq.MQCSP();
  csp.Token = token;

  // Make the MQCNO refer to the MQCSP
  // This line allows use of the userid/password
  cno.SecurityParms = csp;

  // And use the MQCD to programatically connect as a client
  // First force the client mode
  cno.Options |= MQC.MQCNO_CLIENT_BINDING;
  // And then fill in relevant fields for the MQCD
  const cd = new mq.MQCD();
  cd.ConnectionName = cf.connectionName;
  cd.ChannelName = cf.channel;
  // Make the MQCNO refer to the MQCD
  cno.ClientConn = cd;

  // Now we can try to connect
  mq.Connx(cf.qMgrName, cno, (err,conn) => {
    if (err) {
      console.log(formatErr(err));
    } else {
      console.log("MQCONN to QM %s successful ", cf.qMgrName);
      // Sleep for a few seconds - bad in a real program but good for this one
      sleep(3 *1000).then(() => {
        mq.Disc(conn, (err2) => {
          if (err2) {
            console.log(formatErr(err2));
          } else {
            console.log("MQDISC successful");
          }
        });
      });
    }
  });
}

/*
 *  The main program starts here.
 */
console.log("Sample AMQSJWT.JS start");
parseArgs();
obtainToken(connect);

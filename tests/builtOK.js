'use strict';

/*
 * To be run via "npm run test" in the parent directory
 *
 * This is a very basic test to pick up gross errors in the build
 * process. It can be run either for a "local" build or in an environment
 * where the MQ Redistributable Client libraries may not be available.
 * 
 * When there are no MQ libraries available, there is a dlopen failure. But to 
 * get that far, we've already had to exercise the compiled C++ Node-addon module.
 * So the expected message is trapped here and we consider that a successful test.
 */

let rc = 0;

const args = process.argv.slice(1);
let qmgr = "UNKNOWNQMGR";
if (args[1]) {
  qmgr = args[1];
}

console.log("Running build test for qmgr: ", qmgr);

try {
  const mq = require('..');
  const MQC = mq.MQC;

  /* I expect the connection to fail here with MQRC_Q_MGR_NAME_ERROR */
  mq.ConnSync(qmgr, function (err, hConn) {
    if (err != null) {
      const mqrc = err.mqrc;
      if (mqrc != MQC.MQRC_Q_MGR_NAME_ERROR) {
        console.log("Got unexpected failure: ", err.message);
        rc = -1;
      } else {
        console.log("Got expected failure: ", err.message);
      }
    }
  });
} catch (err) {
  console.log("Test caught: ", err);
  /* This text is from dlerror responses - in theory may vary by platform so we may need to extend */
  if (err.message != null) {
    const msg = err.message.toLowerCase();
    switch (process.platform) {
      case "darwin":
        if (msg.includes("no such file") && msg.includes("mqm")) {
          rc = 0;
        }
        break;
      case "win32":
        if (msg.includes("failed to be loaded") && msg.includes("mqm")) {
          rc = 0;
        }
        break;
      case "linux":
        /* dlerror text */
        if (msg.includes("no such file") && msg.includes("mqm")) {
          rc = 0;
        }
        break;
      default:
        rc = -1;
        break;
    }
  } else {
    rc = -1;
  }
}

console.log("Build test exiting with ", rc);
process.exit(rc);




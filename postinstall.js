"use strict";

// External packages we require
const fs = require("fs");
const path = require("path");
const http  = require("http");
const https = require("https");
const { ProxyAgent } = require("proxy-agent");

const execSync = require("child_process").execSync;

// How to get to the MQ Redistributable Client package
const protocol = "https://";
const host="public.dhe.ibm.com";
const baseDir="ibmdl/export/pub/software/websphere/messaging/mqdev";
const redistDir=baseDir+"/redist";
const macDir=baseDir+"/mactoolkit";

// This is the version (VRM) of MQ associated with this level of package
let vrm="9.3.4";
// This is the default fixpack or CSU level that we might want to apply
const defaultFp="0";

// Allow overriding the VRM - but you need to be careful as this package
// may depend on MQI features in the listed version. Must be given in the
// same format eg "1.2.3". Note that IBM keeps a limited set of versions for
// download - once a version of MQ is no longer supported, that level of
// Redistributable Client package may be removed from public sites.
const vrmenv=process.env.MQIJS_VRM;
if (vrmenv != null) {
  vrm=vrmenv;
}

// Set the fixpack which is also part of the downloadable name. Default
// to 0, which is the base level for CD versions of MQ. Only
// the LTS level gets fixpacks but CD versions do now receive
// CSU ("cumulative security update") releases which are equivalent
// to fixpacks in the installation/version sense.
let vrmf=vrm + "." + defaultFp;

// Allow overriding the fixpack for both LTS and CD versions to permit
// picking up a CSU.
const fixpack=process.env.MQIJS_FIXPACK;
if (fixpack != null ) {
  vrmf=vrm+"."+fixpack;
}

let file=vrmf + "-IBM-MQC-Redist-"; // will be completed by platform filetype
const redistTitle="IBM MQ Redistributable C Client";

const dir=redistDir; // Default
const title=redistTitle;

// Other local variables
let unpackCommand;
let unwantedDirs;
const newBaseDir="redist";

let currentPlatform=process.platform;
// currentPlatform='darwin'; // for forcing a platform test
if (process.env.MQIJS_PLATFORM != null) {
  currentPlatform=process.env.MQIJS_PLATFORM; // Another way to override
}

// Some functions used at the end of the operation
function cleanup(rc) {
  // Always run to try to delete the downloaded zip/tar file
  try {
    // Allow it to be overridden for debug purposes
    const doNotRemove = process.env.MQIJS_NOREMOVE_DOWNLOAD;
    if (doNotRemove == null) {
      console.log("Removing " + file);
      fs.unlinkSync(file);
    } else {
      // If there was an error, we will leave the file alone if it exists,
      // but it's probably not there. So don't print this progress message.
      if (rc == 0) {
        console.log("Preserving " + file);
      }
    }
  } catch(err) {
    // Ignore error
  }
  // This script originally deliberately ignored errors in downloading
  // the redist client package. But when npm changed policy to not
  // print a lot of status output during script execution it was harder
  // to see that something was broken. So we now exit with an error if
  // requested.
  process.exit(rc);
}

function printError(err) {
  console.error("Error occurred downloading " + title + ": " + err.message);
  console.error("You will need to manually install it.");
  cleanup(1);
}

// Equivalent of "rm -rf"
function removeDirRecursive(d) {
  if (fs.existsSync(d)) {
    fs.readdirSync(d).forEach(function (e) {
      const ePath = path.join(d, e);
      if (fs.lstatSync(ePath).isDirectory()) {
        removeDirRecursive(ePath);
      } else {
        // Keep runmqsc as it might be useful for creating CCDTs locally,
        // particularly in a containerised runtime. And runmqakm might be
        // needed if you want to manage certs locally rather than outside
        // a container.
        if (!e.match(/runmqsc/) && !e.match(/runmqakm/) && !e.match(/run.*cred/)) {
          fs.unlinkSync(ePath);
        }
      }
    });
    fs.rmdirSync(d); // This fails on the directory containing runmqsc but that's fine
  }
}

function removePattern(d,type) {
  if (fs.lstatSync(d).isDirectory()) {
    fs.readdirSync(d).forEach(function (e) {
    if (e.match(type)) {
        const ePath = path.join(d, e);
        try {
          fs.unlinkSync(ePath);
        } catch (err) {
          // ignore the error
        }
      }
    });
  }
}

function removeUnthreaded(d) {
  if (fs.lstatSync(d).isDirectory()) {
    fs.readdirSync(d).forEach(function (e) {
      if (e.match(/.*.so/) && !(e.match(/.*_r.so/))) {
        const t = e.replace(".so","_r.so");
        const tpath = path.join(d,t);
        if (fs.existsSync(tpath)) {
          const ePath = path.join(d, e);
          try {
            fs.unlinkSync(ePath);
          } catch (err) {
            // ignore the error
          }
        }
      }
    });
  }
}

// The genmqpkg script is better maintained than having the unwanted directories/files
// explicitly named.
function removeUnneededWithGenMQPkg(fullNewBaseDir) {
  const doNotRemove = process.env.MQIJS_NOREMOVE;
  if (doNotRemove != null) {
    console.log("Environment variable set to keep all files in client package");
  } else {
    // Set the filters for which files genmqpkg is going to preserve
    process.env.genmqpkg_incnls=1;
    process.env.genmqpkg_incsdk=1;
    process.env.genmqpkg_inctls=1;
    process.env.genmqpkg_incras=1;
    process.env.genmqpkg_incadm=1; // For runmqsc, even though it leaves more files than we really need

    let debugGenObj = {};
    let debugGenOpt="";

    if (process.env.MQIJS_TRACE_GENMQPKG != null) {
      debugGenObj = { stdio:"inherit" };
      debugGenOpt="-v";
    }

    const psCmd="cd " + fullNewBaseDir + ";./bin/genmqpkg.sh -b " + debugGenOpt + " " + fullNewBaseDir;

    console.log("Running genmqpkg...");
    execSync(psCmd, debugGenObj );
    cleanup(0);
  }
}

// Remove directories from the client that are not needed for Node execution. This
// should help shrink any runtime container a bit
function removeUnneeded() {
  let d;
  const doNotRemove = process.env.MQIJS_NOREMOVE;
  if (doNotRemove != null) {
    console.log("Environment variable set to keep all files in client package");
  } else {

    for (let i=0;i<unwantedDirs.length;i++) {
      try {
        removeDirRecursive(path.join(newBaseDir,unwantedDirs[i]));
      } catch (err) {
        // don't really care
      }
    }

    if (currentPlatform === "win32") {
      d = path.join(newBaseDir,"bin64");
      removePattern(d,/.exe$/);
      removePattern(d,/^imq.*.dll$/);
    } else {
      d= path.join(newBaseDir,"lib");
      removePattern(d,/lib.*so/);
      removePattern(d,/amqtrc.fmt/);
      removePattern(d,/amqlcelp.*/);

      d= path.join(newBaseDir,"lib64");
      removePattern(d,/libimq.*so/);
      removePattern(d,/libedit.so/);
      removePattern(d,/amq.*.dll/);
      removePattern(d,/amqlcelp$/);

      // Get rid of all the non-threaded libraries
      removeUnthreaded(d);

      d= path.join(newBaseDir,"lap");
      removePattern(d,/.*.jar/);
    }
  }

  cleanup(0);
}

// Start main processing here.

// If a particular environment variable is set, do not try to install
// the Redist client package. I did consider doing this automatically by
// trying to locate the libraries in the "usual" places, but decided it was
// better to be explicit about the choice.
const doit = process.env.MQIJS_NOREDIST;
if (doit != null) {
  console.log("Environment variable set to not install " + title);
  process.exit(0);
}

// Check if the install is for an environment where there is a Redistributable Client.
if (currentPlatform === "win32") {
  // The Windows "unpack" command here simply creates the output directory. Other processing
  // will do the real unpack.
  file=file+"Win64.zip";
  unpackCommand="mkdir " +  newBaseDir;
  unwantedDirs=[ "exits","exits64", "bin",
                 "tools/cobol", "tools/cplus", "tools/dotnet",
                 "tools/c/Samples", "tools/c/include",
                 "tools/Lib", "tools/Lib64",
                 "zips",
                 "java", "bin64/VS2015" ];
} else if (currentPlatform === "linux" && process.arch === "x64"){
  file=file+"LinuxX64.tar.gz";
  unpackCommand="mkdir -p " +  newBaseDir + " && tar -xvzf " + file + " -C " + newBaseDir;
  // These "unwanted" directories are not explicitly used with the genmqpkg.sh command that
  // is now being used.
  unwantedDirs=[ "samp",
                 "bin",
                 "inc",
                 "java",
                 "gskit8/lib",
                 "lib64/netstandard2.0",
                 ".github" ];
// } else if (currentPlatform === 'darwin'){
//  The MacOS client for MQ is released under a different license - 'Developers' not
//  'Redistributable' - so we should not try to automatically download it.
//
//  As another issue, the MacOS client is now being delivered in signed pkg format, not zip. So this won't
//  work anyway. I'm leaving this bit of code in just to remind us of the directory from which
//  the file can be downloaded but simply enabling it in this script is not going to help.
//
//  dir=macDir
//  title="IBM MacOS Toolkit for Developers"
//  file=vrmf + "-IBM-MQ-DevToolkit-MacOS" + ".pkg"
} else {
  console.log("No redistributable client package available for this platform.");
  console.log("If an MQ Client library exists for the platform, install it manually.");
  process.exit(0);
}

// Don't download if it looks to already be there - though Node will usually be running this in a clean directory
const idTagFile = path.join(newBaseDir,"swidtag","ibm.com_IBM_MQ_Client-" + vrm + ".swidtag");
// console.log("Checking for existence of " + idTagFile);
if (fs.existsSync(idTagFile)) {
    console.log("The " + title + " appears to already be installed");
    process.exit(0);
}

console.log("Downloading " + title + " runtime libraries - version " + vrmf);

// Define the file to be downloaded (it will be deleted later, after unpacking)
let url = protocol + host + "/" + dir + "/" + file;
const useLocalUrl = process.env.MQIJS_LOCAL_URL;
const useLocalServer = process.env.MQIJS_LOCAL_SERVER;

if (useLocalUrl != null) {
  url = useLocalUrl + "/" + file;
} else if (useLocalServer != null) {
  url = "http://localhost:8000/"+file; // My local version for testing this script
}
console.log("Getting " + url);

let client = http;
if (url.startsWith("https"))
  client=https;

// Now download and unpack the file in the platform-specific fashion.
// The 'request' package would simplify this code, but it introduces too many
// prereqs for just an installation step.
try {
  // The downloaded file goes into the current directory (node_modules/ibmmq)
  const fd = fs.openSync(file, "w");
  const agent = new ProxyAgent();

  client.get(url, { agent }, (res) => {
    let error;

    if (res.statusCode < 200 || res.statusCode > 299) {
      error = new Error("Request Failed.\nStatus Code: " + res.statusCode);
    }

    if (error) {
      res.resume();
      printError(error);
    }

    res.on("data", (chunk) => {
      fs.appendFileSync(fd,chunk);
    });
    res.on("end", () => {
      try {
        fs.closeSync(fd);
        const fullNewBaseDir=path.resolve(newBaseDir);
        console.log("Unpacking libraries into "+ fullNewBaseDir + "...");
        execSync(unpackCommand);
        // On Windows we use PowerShell to do the unpacking of the zip
        // file. We can be "reasonably" certain that this will work. The Node.js
        // unzip packages seemed to sometimes create corrupt files silently.
        if (currentPlatform === "win32") {
          const psCmd = "Expand-Archive -Force -Path " + file + " -DestinationPath " + newBaseDir ;
          const psCmd2 = "powershell -command \"" + psCmd + "\"";
          execSync(psCmd2, { windowsHide:true });
          removeUnneeded();
        } else {
          removeUnneededWithGenMQPkg(fullNewBaseDir);
          // removeUnneeded();
        }
      } catch (err) {
        printError(err);
      }
    });
  }).on("error", (err) => {
    printError(err);
  });
} catch (err) {
  printError(err);
}

'use strict';

// External packages we require
var fs = require('fs');
var path = require('path');
var http  = require('http');
var https = require('https');

const execSync = require('child_process').execSync;

// How to get to the MQ Redistributable Client package
var protocol = "https://";
var host="public.dhe.ibm.com";
var baseDir="ibmdl/export/pub/software/websphere/messaging/mqdev";
var redistDir=baseDir+"/redist";
var macDir=baseDir+"/mactoolkit";

// This is the version (VRM) of MQ associated with this level of package
var vrm="9.2.1";

// Allow installing it on darwin with an environment variable
// so we do not need to do the post install stuff modifying node_modules/ibmmq stuff
var downloadInDarwin=process.env['MQIJS_DARWIN_REDIST'];

// Allow overriding the VRM - but you need to be careful as this package
// may depend on MQI features in the listed version. Must be given in the
// same format eg "1.2.3". Note that IBM keeps a limited set of versions for
// download - once a version of MQ is no longer supported, that level of
// Redistributable Client package is removed from public sites.
var vrmenv=process.env['MQIJS_VRM'];
if (vrmenv != null) {
  vrm=vrmenv;
}

// Set the fixpack which is also part of the downloadable name. Default
// to 0, which is the only allowable level for CD versions of MQ. Only
// the LTS level gets fixpacks.
var vrmf=vrm + ".0";
// Allow overriding the fixpack if VRM indicates an LTS version
var fixpack=process.env['MQIJS_FIXPACK'];
if (fixpack != null && vrm.endsWith('.0')) {
  vrmf=vrm+"."+fixpack;
}

var file=vrmf + "-IBM-MQC-Redist-"; // will be completed by platform filetype
var redistTitle="IBM MQ Redistributable C Client";

var dir=redistDir; // Default
var title=redistTitle;

// Other local variables
var rc = 0;
var unpackCommand;
var unwantedDirs;
const newBaseDir="redist";
var currentPlatform=process.platform;
var preferredVersion=14;
//currentPlatform='darwin'; // for forcing a platform test

// Some functions used at the end of the operation
function cleanup() {
  // Always run to try to delete the downloaded zip/tar file
  try {
    // Allow it to be overridden for debug purposes
    var doNotRemove = process.env['MQIJS_NOREMOVE_DOWNLOAD'];
    if (doNotRemove == null) {
      console.log("Removing " + file);
      fs.unlink(file);
    } else {
      console.log("Preserving " + file);
    }
  } catch(err) {
  }

  // Always exit OK, even after an error so the rest of the install succeeds.
  process.exit(0);
}

function printError(err) {
  console.error("Error occurred downloading " + title + ": " + err.message);
  console.error("You will need to manually install it.");
  cleanup();
}

// Equivalent of "rm -rf"
function removeDirRecursive(d) {
  if (fs.existsSync(d)) {
        fs.readdirSync(d).forEach(function(e) {
            var ePath = path.join(d, e);
            if (fs.lstatSync(ePath).isDirectory()) {
                removeDirRecursive(ePath);
            } else {
                // Keep runmqsc as it might be useful for creating CCDTs locally,
                // particularly in a containerised runtime
                if (!e.match(/runmqsc/))
                  fs.unlinkSync(ePath);
            }
        });
        fs.rmdirSync(d); // This fails on the directory containing runmqsc but that's fine
    }
}

function removePattern(d,type) {
  if (fs.lstatSync(d).isDirectory()) {
    fs.readdirSync(d).forEach(function(e) {
    if (e.match(type)) {
        var ePath = path.join(d, e);
        try {
          fs.unlinkSync(ePath);
        } catch (err) {
        }
      }
    });
  }
}

// Remove directories from the client that are not needed for Node execution
function removeUnneeded() {
  var d;
  var doNotRemove = process.env['MQIJS_NOREMOVE'];
  if (doNotRemove != null) {
    console.log('Environment variable set to keep all files in client package');
  } else {

    for (var i=0;i<unwantedDirs.length;i++) {
      try {
        removeDirRecursive(path.join(newBaseDir,unwantedDirs[i]));
      } catch (err) {
        // don't really care
      }
    }

    if (currentPlatform === 'win32') {
      d = path.join(newBaseDir,"bin64");
      removePattern(d,/.exe$/);
      removePattern(d,/^imq.*.dll$/);
    } else {
      d= path.join(newBaseDir,"lib");
      removePattern(d,/lib.*so/);
      removePattern(d,/amqtrc.fmt/);
      d= path.join(newBaseDir,"lib64");
      removePattern(d,/libimq.*so/);
      removePattern(d,/libedit.so/);
    }
  }

  cleanup();
}

function checkNodeVersion() {
  // V10/V12 seem to have unexpected internal failures in some levels,
  // possibly related to the ffi-napi package. But V14
  // looks to be OK. Rather than enforce that as a prereq level, at least
  // give a warning to point at V14 as a preferred version.
  var major=process.versions.node.split('.')[0];
  if (major < preferredVersion) {
    console.warn("Current Node version is " + process.versions.node);
    console.warn("Preferred version is at least " + preferredVersion);
  }
}

// Start main processing here.
checkNodeVersion();

// If a particular environment variable is set, do not try to install
// the Redist client package. I did consider doing this automatically by
// trying to locate the libraries in the "usual" places, but decided it was
// better to be explicit about the choice.
var doit = process.env['MQIJS_NOREDIST'];
if (doit != null) {
  console.log("Environment variable set to not install " + title);
  process.exit(0);
}

//Check if the install is for an environment
// where there is a Redistributable Client.
if (currentPlatform === 'win32') {
  file=file+"Win64.zip";
  unpackCommand="mkdir " +  newBaseDir;
  unwantedDirs=[ "exits","exits64", "bin", "Tools","java", "bin64/VS2015" ];
} else if (currentPlatform === 'linux' && process.arch === 'x64'){
  file=file+"LinuxX64.tar.gz";
  unpackCommand="mkdir -p " +  newBaseDir + " && tar -xvzf " + file + " -C " + newBaseDir;
  unwantedDirs=[ "samp", "bin","inc","java", "gskit8/lib", ".github" ];
} else if (currentPlatform === 'darwin' && downloadInDarwin){
//  The MacOS client for MQ is released under a different license - 'Developers' not
//  'Redistributable' - so we will not try to automatically download it. But all the
//  pieces are in this script to enable it at some point.

 dir=macDir
 title="IBM MacOS Toolkit for Developers"
 file=vrmf + "-IBM-MQ-Toolkit-MacX64" + ".tar.gz"
 unpackCommand="mkdir -p " +  newBaseDir + " && tar -xvzf " + file + " -C " + newBaseDir;
 unwantedDirs=[ "samp", "bin","inc","java", "gskit8/lib", ".github" ];
} else {
  console.log("No redistributable client package available for this platform.");
  console.log("If an MQ Client library exists for the platform, install it manually.");
  process.exit(0);
}

// Don't download if it looks to already be there - though Node will usually be running this in a clean directory
var idTagFile = path.join(newBaseDir,"swidtag","ibm.com_IBM_MQ_Client-" + vrm + ".swidtag");
//console.log("Checking for existence of " + idTagFile);
if (fs.existsSync(idTagFile)) {
    console.log("The " + title + " appears to already be installed");
    process.exit(0);
}

console.log("Downloading " + title + " runtime libraries - version " + vrmf);

// Define the file to be downloaded (it will be deleted later, after unpacking)
var url = protocol + host + "/" + dir + "/" + file;
//url = "http://localhost:8000/"+file; // My local version for testing
console.log("Getting " + url);

var client = http;
if (url.startsWith("https"))
  client=https;

// Now download and unpack the file in the platform-specific fashion.
// The 'request' package would simplify this code, but it introduces too many
// prereqs for just an installation step.
try {
  // The downloaded file goes into the current directory (node_modules/ibmmq)
  var fd = fs.openSync(file, "w");
  client.get(url, (res) => {
    var error;

    if (res.statusCode < 200 || res.statusCode > 299) {
      error = new Error("'Request Failed.\nStatus Code: " + res.statusCode);
    }

    if (error) {
      res.resume();
      printError(error);
    }

    res.on('data', (chunk) => {
      fs.appendFileSync(fd,chunk);
    });
    res.on('end', () => {
      try {
        fs.closeSync(fd);
        console.log("Unpacking libraries...");
        execSync(unpackCommand);
        // On Windows we have to run the unzip separately as there may
        // not be a command line interface available. So use a nodejs
        // package to manage it.
        if (currentPlatform === 'win32') {
          var unzip = require('unzipper');
          fs.createReadStream(file)
             .pipe(unzip.Extract({ path: newBaseDir })
             .on('close',function() {
               console.log("Finished Windows unzip");
               removeUnneeded();
             }));
        } else {
          removeUnneeded();
        }
      } catch (error) {
        printError(error);
      }
    });
  }).on('error', (error) => {
    printError(error);
  });
} catch (err) {
  printError(err);
}

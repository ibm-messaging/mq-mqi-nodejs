# mq-mqi-nodejs
This repository demonstrates a way to call IBM MQ from applications running in a Node.js environment.

## N-API REWRITE for V2 (Jun 2023)
This version of the package has been heavily rewritten, to remove some of the outdated/unmaintained dependencies. There
are other potential benefits to the rewrite, including improved performance and the opportunity to port to platforms
that the dependencies could not support.

See the [BREAKING_CHANGES](BREAKING_CHANGES_V2.md) file for changes you might need to make to your application.

## MQI Description
The package exposes the IBM MQ programming interface via a wrapper layer implemented in JavaScript. This should make it
easy for a Node.js developer to send and receive messages via MQ, and interact with other MQ-enabled applications in the
organisation.

The package is based on the full MQI. It uses essentially the same verbs and structures as the C or COBOL interface, but
with a more appropriate style for this environment. It removes the need for a developer to worry about how to map
elements to the underlying C libraries and instead enables a focus on the business application code. For example,
JavaScript strings are used instead of fixed-length, spaced-padded fields.

Most MQI verbs and parameters are implemented here. Where there are missing details within the verbs, these are shown by
TODO markers in the source files.

It is assumed that someone using this package does have a basic understanding of the procedural MQI, as that is needed
to decide which options and fields may need to be set for each verb.

The implemented verbs follow the JavaScript style, invoking user-supplied callback functions on completion. In all
cases, the callbacks are presented with an MQError object as the first parameter when an error or warning occurs (null
otherwise), followed by other relevant objects and data. If the callback is not provided by the application, then either
an exception is thrown, or the verb returns.

###  Synchrony
The main verbs - `Conn(x)`, `Disc`, `Open`, `Close`, `Sub`, `Put`, `Put1` and `Get` - have true synchronous and
asynchronous variations. The default is that these verbs are asynchronous, to be more natural in a Node.js environment.
When given a `...Sync` suffix (eg `OpenSync`) then the verb is synchronous. Callback functions are required for the
OpenSync and SubSync verbs to obtain the object handles; these are not returned explicitly from the function calls.

The remaining verbs (including `Cmit` and `Back`) internally make synchronous calls to the underlying MQI
services. Callback functions can still be used to indicate completion of the operation, with function return values and
exceptions being available if you want to treat them more synchronously rather than pseudo-async.

For the asynchronous functions, a callback function is mandatory.

Note that MQ also has a concept of Asynchronous Put (an MQPMO option) usable from client applications. That can be used
in conjunction with a later call to the `Stat` function to determine the success of the Put calls, but it is not related
to asynchronous notification of the operation completion in JavaScript terms.

#### Synchronous compatibility option
The SyncMQICompat tuning parameter (among other tuning options) has been removed with the V2 implementation.

### Promises
Most of the core MQI verbs (excluding the GET variants) have Promise-based alternatives named with a `...Promise` suffix
(eg `ConnxPromise`). This can help with removal of much of the typical callback nesting. See the amqsputp.js sample for
a demonstration of how these can be used. There is no Get-based Promise because the async Get operation invokes
callbacks multiple times as messages appear.

### Message Retrieval
This implementation includes two mechanisms for retrieving messages from a queue:
* *GetSync()* is the call that does an MQGET(wait) synchronously. In a Node environment, it blocks the execution thread
  until it completes. That may be OK for an immediate retrieval where the wait time is set to zero, but it is not
  recommended for any times where you want to wait a while for a message to arrive. Some of the samples use this
  function for simplicity, where the Get() is not the interesting aspect being demonstrated.
* *Get()* is the call that works asynchronously. The callback given as a parameter to this function is invoked
  asynchronously. The function remains active after delivering a message to permit receipt of multiple messages. To stop
  the callback being called for further messages, use the *GetDone()* function. This behaviour is similar to how the MQI
  *MQCB* callback invocation works.

This package uses MQCB/MQCTL-managed callbacks for true asynchronous processing. As such, some of the TuningParameter
values that were available in the 1.x versions of the code have been removed. You will get an exception if you try to
use those parameters.

For more advanced handling of inbound messages, there is a *Ctl()* verb. This is an analogue of `MQCTL` and requires you
to explicitly start message consumption. It is the default behaviour. You should always use this if you are going to
open multiple queues simultaneously for reading. The `tuningParameter.useCtl` or `MQIJS_NOUSECTL` environment variable
control whether or not to require use of the new verb. Older applications can use `useCtl=false` or the environment
variable for backwards compatibility; newer applications should use *Ctl()* going forward.

Sample programs **amqsget**, **amqsgeta**, and **amqsgetac** demonstrate the different techniques.

### Calling the MQI from the message delivery callback

The callback function invoked as part of *Get()* processing has to be scheduled to run on a different OS thread than the
MQI thinks it has called. The default strategy for how this is managed internally allows you to call the MQI from your
callback function. You can, for example, call *Cmit()* from the callback function, safely knowing which message
operations will be committed.

#### Alternative callback strategy

There is an alternative callback strategy that a tuning parameter option configures.
```
  mq.setTuningParameters({callbackStrategy: "READAHEAD"});
```

Setting this option MIGHT make retrieval of large numbers of messages run faster. But it can also cause operations to
overlap. So you might not know which messages have actually been removed from the queue. It is therefore definitely not
recommended if you care about transactionality. And if you want to call the MQI from within your callback in this mode,
you will have to manually suspend callbacks temporarily. Otherwise you will probably get an `MQRC_HCONN_ASYNC_ACTIVE`
(2500) error returned.

Instead, you can temporarily disable the asynchronous delivery, call the MQI, and then resume. For example, if you want
to *Inq()* on some aspect of the queue, then doing something like this works inside the Node.js callback.

```
  mq.Ctl(connectionHandle, MQC.MQOP_SUSPEND, function (err) {
    if (err) console.log(formatErr(err));
  });
  var selectors = [ new mq.MQAttr(MQC.MQIA_CURRENT_Q_DEPTH)];
  mq.Inq(queueHandle,selectors, function (err) {
    if (err) console.log(formatErr(err));
  });
  mq.Ctl(connectionHandle, MQC.MQOP_RESUME, function (err) {
    if (err) console.log(formatErr(err));
  });
```
The *Ctl()* and *Inq()* calls in this fragment are synchronous operations, so do not need to be nested inside callbacks.

## Message body
When putting messages, JavaScript Buffers and strings can be used; string values automatically set the MQMD Format field
to "MQSTR". When getting messages, data is always returned in a Buffer.

## Alternative JavaScript routes into MQ
There are already some other ways to access MQ from Node.js:
* MQ supports connections via AMQP channels. There are a number of AMQP 1.0 client implementations available for Node.js.
* The MQTT protocol has an implementation [here](https://www.npmjs.com/package/mqtt). MQ supports connections from MQTT
  clients via the XR service and Telemetry channels.
* MQ has a simple REST API for messaging that is accessible from any environment. See
  [here](https://www.ibm.com/docs/en/ibm-mq/latest?topic=api-getting-started-messaging-rest) for more information.

These interfaces may be suitable for many messaging applications, even though they do not give access to the full
services available from MQ such as transactions.

## Unimplemented capabilities
All the application-level MQI verbs are implemented. Structures and verbs that are only used in other environments - for
example in exits - are not provided as only C is a supported language for those operations.

There are no structure definitions for most MQ header elements in message contents such as the MQCIH structure.

However there is a definition and sample program to manipulate the Dead Letter Header (MQDLH). There is also a
definition for the MQRFH2 structure header, though not for the individual folders and properties that may be added to
that structure. Instead of explicitly using an MQRFH2, it is recommended you use the message property APIs.

The **amqsget** sample shows ways to process the returned message, including extracting details from the MQDLH and MQRFH2
structures if they are part of the message.

## Local queue manager connectivity

The C MQ library is dynamically loaded at runtime. By default, this package will try to load the library from the
`node_modules` directory associated with the application.

For platforms where the MQ Redistributable Client exists and has been installed, this means that local bindings
connections will not work to connect to a queue manager, even if there is also a full MQ installation on the machine.
Only client connections can be used by the Redistributable Client libraries. Trying to connect to a local queue manager
will likely result in an **MQRC_Q_MGR_NAME_ERROR** (2058) error.

To override this default behaviour and to permit use of local bindings connections, the full MQ installation libraries
must be used instead. There are two mechanisms to do this:
* Set the `MQIJS_NOREDIST` environment variable during `npm install` so that the Redist Client package is not downloaded
  and installed in the `node_modules` directory.
* Set the `MQIJS_PREFER_INSTALLED_LIBRARY` environment variable at runtime

The use of the Redist Client libraries is preferred wherever possible, so that new function can be introduced regardless
of the version of MQ that has been "properly" installed on a machine.

## Client connectivity

Client connections work in the usual way.
* Definitions can be set up externally via CCDT or the MQSERVER environment variable
* Definitions can be set up programmatically via the MQCD and MQSCO structures passed to *Connx()*

To force client connections, even when there is a full MQ server set of libraries installed and loaded:
* The program can set the `MQCNO_CLIENT_BINDING` flag in the MQCNO options during *Connx()*
* You can set the `MQ_CONNECT_TYPE` environment variable to "CLIENT".

## Extra operations
The package includes a couple of verbs that are not standard in the MQI.
* *GetDone()* is used to end asynchronous retrieval of messages.
* *GetSync()* is equivalent of the traditional MQGET operation.
* *Lookup()* extracts strings corresponding to MQI numbers, similar to the *MQConstants.lookup()* method in Java.

## Requirements
* node version 16 or greater.
* On platforms other than Windows and Linux x64, you must also install the MQ client package
* I have run it on Windows, where the NPM 'windows-build-tools' package also needed to be installed first. See
  [this document](https://github.com/Microsoft/nodejs-guidelines/blob/master/windows-environment.md#environment-setup-and-configuration)
  for more information on Windows.

## Installation:
To install this package, you can pull it straight from the NPM repository. You can also refer to it in a package.json
file for automatic installation.

~~~
mkdir <something>
cd <something>
npm install ibmmq
~~~

### Prerequisite components

Installation of the package will automatically install any prerequisite packages downloadable from the npm repository.
By default, it will pull in packages listed in both the `dependencies` and the `devDependencies` sections. For
environments where you only want to run a program, then adding an option `npm install --only=prod` or setting the
`NODE_ENV` environment variable to `production` will cause downloads of only the runtime dependencies.

### The MQ C Client libraries

The package requires the MQ C client libraries to be installed/available.

For Windows and Linux x64, the npm installation process tries to access the Redistributable Client packages and unpack
them automatically.

Note: IBM removes older levels of the Redistributable Client packages when they become unsupported. If you want to
continue to use older versions of this package (which will reference those unsupported MQ versions) then you will have
to keep a local copy of the tar/zip files and unpack it as part of your build process, using the MQIJS_* environment
variables to control installation and runtime.

#### Controlling the download location

The download of the Redistributable Client packages will, by default, try to go to the `public.dhe.ibm.com` site. If
that is not reachable - perhaps you are installing into a machine that does not have access to the public internet -
then you can override the location that the install process tries to use. Set the environment variable
`MQIJS_LOCAL_URL` to something like `https://myserver.example.com:8080/MQClients`.

You might also considering copying the Redistributable Client package to one of your own servers, and pointing at that,
as a way of handling any unavailability of the `dhe.ibm.com` site.

If you do not want the automatic installation of the MQ runtime at all, then set the environment variable
`MQIJS_NOREDIST` to any value before running npm install. The MQ libraries are then be found at runtime using mechanisms
such as searching `LD_LIBRARY_PATH` (Linux) or `PATH` (Windows).

## Controlling the downloaded version

The post-installation program will usually be pointing at the most recent Continuous Delivery version of MQ (for example
9.1.4.0). These versions of MQ do not have fixpacks released, though they may have updates available specifically aimed
at security vulnerabilities (CSU packages). You can override both the version (VRM) and fixpack to be installed,
assuming that full VRMF level is still available for download. Setting the environment variables `MQIJS_VRM` and
`MQIJS_FIXPACK` will select a specific Redistributable Client package to be installed. Note that installing an older VRM
than the default in the current version of this package may not work, if newer options have been introduced to the MQI.
At the time of writing this paragraph, the latest version of MQ was 9.2.0 (with no later CD releases), but there was
also a 9.2.0.1 fixpack. If you want to pick that up instead of the base 9.2.0.0 referred to in postinstall.js, then set
`MQIJS_FIXPACK=1` before running `npm install`. Once newer CD levels are available, then the postinstall script will
point at those instead by default. If you want to select a CSU level (very similar to a fixpack, but with a more limited
scope) then the same environment variable can be used.

### Setting environment variables for the installation process

The MQIJS_* environment variables used during  `npm install` can also be set in an *.npmrc* file.  These are more commonly
written in lowercase, so `export MQIJS_VRM=9.3.4` would become `mqijs_vrm=9.3.4` in the NPM configuration file. But
the package does attempt to reference a variety of case options. The real environment variable takes precedence over the
*.npmrc* setting.

### Downloading behind a proxy

Downloading the Redistributable C Client libraries behind a proxy is supported. Use the environment variables
`https_proxy` and `no_proxy` to control proxy behaviour.

For example, the following command will use a proxy server at `http://localhost:8080` to download the redistributable
libraries:

```
% HTTPS_PROXY=http://localhost:8080 npm install
```

You can disable this behaviour by adding `public.dhe.ibm.com` to the `NO_PROXY` environment variable. The following
command will not use the proxy to download the redistributable libraries:

```
% NO_PROXY="public.dhe.ibm.com" HTTPS_PROXY=http://localhost:8080 npm install
```

Alternatively, you can simply `unset HTTPS_PROXY`.

### MacOS
The MQ client package for MacOS can be found at
[this site](https://public.dhe.ibm.com/ibmdl/export/pub/software/websphere/messaging/mqdev/mactoolkit). Download a
suitable version and install it in a local directory. The package is signed, and is not a simple tar/zip format. The
environment variable `DYLD_LIBRARY_PATH` then should be set to the lib64 directory within that tree before running the
program.

For example

`export DYLD_LIBRARY_PATH=/opt/mqm/lib64`

The MacOS client is also now available via the `brew` command. See [here](https://github.com/ibm-messaging/homebrew-ibmmq)
for instructions on configuring your system for downloads using this mechanism.

#### Errors and warnings during build
If you get an error message such as "gyp: No Xcode or CLT version detected" while running `npm install` you may need to
install the developer tools. Usually the command `xcode-select --install` will deal with this.

### Other platforms
For other MQ-supported platforms and environments, the C runtime can be installed from your MQ installation media, or
from the full Client downloads at [this site](https://www.ibm.com/support/fixcentral/swg/selectFixes?parent=ibm~WebSphere&product=ibm/WebSphere/WebSphere+MQ&platform=All&function=fixid&fixids=*-IBM-MQC-*).

The Redistributable Client packages for Windows and Linux x64 are also available directly from
[this site](https://public.dhe.ibm.com/ibmdl/export/pub/software/websphere/messaging/mqdev/redist).

This package cannot currently run on z/OS as the prerequisite MQ libraries are not available there in the same way as
other platforms. However, it might be possible in future to add that platform as there are no dependencies on 3rd party
non-core components (eg lib-ffi) that would never be available on z/OS.

## Sample applications
See the samples [README](samples/README.md) file for more information about the sample programs.

## Containers

The samples directory includes a Dockerfile that can be used as the basis of generating an independent container to run
MQ programs. The **run.docker** script builds and executes the container. Environment variables are used in the
Dockerfile and the script to control connection to the queue manager.

## Documentation

The package contains JSDoc comments that can be formatted using the **makedoc** script in the root directory. The
generated documentation is then accessible via a web browser.

## TypeScript

The package includes a set of type definitions, suitable for use with TypeScript programs. Some of the sample programs
have also been converted to use types. See the `samples/typescript` directory. These definitions have been tested with
the `tsc` compiler, the `ts-node` front-end, and inside the VSCode IDE.


### Bitwise vs Array Options fields

To help with syntax checking, many of the fields in the MQI that are normally set with bitwise operations (for example,
`pmo.Options = MQPMO_SYNCPOINT|MQPMO_NEW_CORREL_ID`) can also be set using an array syntax such as
`pmo.Options = [MQPMO_SYNCPOINT, MQPMO_NEW_CORREL_ID]`. Once you make a choice in your application on which style to
use, you should stay consistent throughout the program. If input to an MQI function uses arrays, then the field will
still be an array on return from the function. It doesn't change shape within the MQI call. But sometimes you may still
need an explicit definition as the fields are defined as having either a number or an array type and the compiler may
not know which it is set to at some places when it needs to validate the code.

If you are using the array format, then any elements with the real value 0 will not show up in the array after an MQI
call. For example, `MQPMO_NONE` would not be in the array following an MQPUT call even if you had set it in the original
array.


Interrogating and modifying the options fields has to be done by being explicit about how the field is being used. For
example,

```
  pmo.Options = [MQC.MQPMO_NO_SYNCPOINT, MQC.MQPMO_NEW_MSG_ID, MQC.MQPMO_NEW_CORREL_ID];
  mq.PutSync( ... )

  var opts = pmo.Options as mq.MQC_MQPMO[]; // Be explicit
  if (opts.includes(MQC.MQPMO_SYNCPOINT)) {
    console.log("Array includes value SYNCPOINT");
  } else {
    console.log("Array does not include value SYNCPOINT");
  }
```

and an example from the `amqsbra.ts`example where we use the bitwise operations to modify a field:

```
  gmo!.Options = ((gmo!.Options as number) & ~MQC.MQGMO_BROWSE_FIRST);
  gmo!.Options = (gmo!.Options | MQC.MQGMO_BROWSE_NEXT);
```

## Support for OpenTelemetry Tracing
If your application is using OTel tracing, then context for traces/spans can be propagated through MQ messages as work
moves between applications. There should be no need for applications to change for this MQ transfer to happen; available
OTel libraries are automatically recognised and used. See comments in `lib/mqiotel.js` for more information.

The only MQI extension is the optional use of an `OtelOpts.RemoveRFH2` flag on the MQGMO structure.

## History

See [CHANGES](CHANGES.md).

## Health Warning

This package is provided as-is with no guarantees of support or updates. You cannot use IBM formal support channels
(Cases/PMRs) for assistance with material in this repository.

Versioned releases are made in this repository to assist with using stable APIs.
There are also no guarantees of compatibility with any future versions of the package; the API is subject to change
Future versions will follow semver guidance so that breaking changes will only be done with a new major version number.

## Issues and Contributions

For feedback and issues relating specifically to this package, please use the
[GitHub issue tracker](https://github.com/ibm-messaging/mq-mqi-nodejs/issues).

Contributions to this package can be accepted under the terms of the Developer's Certificate of Origin, found in the
[DCO file](DCO1.1.txt) of this repository. When submitting a pull request, you must include a statement stating you
accept the terms in the DCO.


## Acknowledgements
Thanks to the IBM App Connect team for the initial implementation of the asynchronous MQI variations. Their work has
been adopted and adapted into this library.

Thanks to Andre Asselin for the TypeScript definitions and sample program conversions.

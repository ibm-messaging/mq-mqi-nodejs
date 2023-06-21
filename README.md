# mq-mqi-nodejs
This repository demonstrates a way to call IBM MQ from applications
running in a Node.js environment.

NOTE: This release will be the final one for the 1.x stream. The 
next release will be 2.x, with some minor breaking API changes.

## MQI Description
The package exposes the IBM MQ programming interface via
a wrapper layer implemented in JavaScript. This should make it
easy for a Node.js developer to send and receive messages via MQ, and
interact with other MQ-enabled applications in the organisation.

The package is based on the full MQI. It uses essentially the
same verbs and structures as the C or COBOL interface, but with a more
appropriate style for this environment.
It removes the need for a developer to worry about
how to map elements to the underlying C libraries and instead
enables a focus on the
business application code. For example, JavaScript strings are used
instead of fixed-length, spaced-padded fields.

Most MQI verbs and parameters are implemented here.
Where there are missing details within the verbs, these are shown by TODO
markers in the source files.

It is assumed that someone using this package does have a basic
understanding of the procedural MQI, as that is needed to decide which
options and fields may need to be set for each verb.

The implemented verbs follow the JavaScript style, invoking
user-supplied callback functions on completion. In all cases, the callbacks
are presented with an MQError object as the first parameter when an error
or warning occurs (null otherwise), followed by other relevant
objects and data. If the callback is not provided by the application,
then either an exception is thrown, or the verb returns.

###  Synchrony
**Note**: This has changed significantly from the 0.9.2 version of the module onwards.

The main verbs - `Conn(x)`, `Disc`, `Open`, `Close`, `Sub`, `Put`, `Put1`
and `Get` - have
true synchronous and asynchronous variations. The default is that the verbs
are asynchronous, to be more natural in a Node.js environment. When given a `...Sync`
suffix (eg `OpenSync`) then the verb is synchronous. Callback functions are now required
for the OpenSync and SubSync verbs to obtain the object handles; these are not returned
explicitly from the function calls.

The remaining verbs continue to internally make synchronous calls to the underlying
MQI services. Callback functions can still be used to indicate completion of the
operation, with function return values and exceptions being available if you want to
treat them more synchronously rather than pseudo-async.

For the asynchronous functions, a callback function is mandatory.

Note that MQ also has a concept of Asynchronous Put (an MQPMO option) usable from
client applications. That can be used in conjunction with a later call to the `Stat`
function to determine the success of the Put calls, but it is not related to
asynchronous notification of the operation completion in JavaScript terms.

#### Synchronous compatibility option
If you wish to continue to use the original pseudo-async calls made by this module
without changing the verbs to use the Sync variants, then you can set the SyncMQICompat
variable to `true`. This variable should be considered a temporary migration path; it
will likely be removed at some point in the future.

### Promises
Most of the core MQI verbs (excluding the GET variants) have Promise-based alternatives
named with a `...Promise` suffix (eg `ConnxPromise`). This can help with removal of much
of the typical callback nesting. See the amqsputp.js sample for a demonstration
of how these can be used. There is no Get-based Promise because the async Get operation invokes
callbacks multiple times as messages appear.

### Message Retrieval
This implementation includes two mechanisms for retrieving messages from
a queue:
* *GetSync()* is the call that does an MQGET(wait) synchronously. In a Node
environment, it blocks the execution thread until it completes. That may
be OK for an immediate retrieval where the wait time is set to zero,
but it is not recommended for any times where
you want to wait a while for a message to arrive. Some of the samples use
this function for simplicity, where the Get() is not the interesting aspect
being demonstrated.
* *Get()* is the call that works asynchronously. The callback
given as a parameter to this function is invoked asynchronously. The function remains
active after delivering a message to permit receipt of multiple messages. To
stop the callback being called for further messages, use the *GetDone()* function. This
behaviour is similar to how the MQI *MQCB* callback invocation works.

The asynchronous retrieval is implemented using a polling MQGET(immediate)
operation. Originally, this package used the MQCB and MQCTL functions to
work fully asynchronously, but the threading model used within the
MQ libraries does not work well with the Node model, and testing
demonstrated deadlocks that could not be solved without changes
to the underlying
MQ products. The polling is done by default every 10 seconds; applications
can override that by calling the *setTuningParameters* function.

Sample programs **amqsget** and **amqsgeta** demonstrate the two different
techniques.

## Alternative JavaScript routes into MQ
There are already some other ways to access MQ from Node.js:
* Take a look at
the [MQ Light](https://developer.ibm.com/messaging/mq-light/getting-started-mq-light/)
client available from [NPM](https://www.npmjs.com/package/mqlight). MQ supports
connections from MQ Light clients via AMQP channels.
* The MQTT protocol has an implementation [here](https://www.npmjs.com/package/mqtt). MQ supports
connections from MQTT clients via the XR service and Telemetry channels.
* MQ V9.0.4 includes a simple REST API for messaging that is accessible from any environment.
See [here](https://www.ibm.com/support/knowledgecenter/en/SSFKSJ_latest/com.ibm.mq.pro.doc/q130020_.htm#q130020___messagingapi) for more information.

These interfaces may be suitable for many messaging applications, even though
they do not give access to the full services available from MQ such as transactions.

## Unimplemented capabilities
All the application-level MQI verbs are implemented.

There are no structure definitions for most MQ elements in message contents such
as the MQCIH structure. When putting messages, JavaScript Buffers and
strings can be used; when getting messages, data is always returned in a Buffer.

However there is now a definition and sample program to manipulate the Dead
Letter Header (MQDLH). This should be considered experimental for now - there
may be better ways to work with the structures. There is also a definition for
the MQRFH2 structure header, though not for the individual folders and properties
that may be added to that structure.

The amqsget sample shows ways to process the returned message, including
extracting details from the MQDLH and MQRFH2 structures if they are part of
the message.

## Local queue manager connectivity

The C MQ library is dynamically loaded at runtime. By default, this package will
try to load the library from the `node_modules` directory associated with the
application.

For platforms where the MQ Redistributable Client exists and has been installed, this means that
local bindings connections will not work to connect to a queue manager, even if there
is also a full MQ installation on the machine. Only client connections can be used by the Redistributable
Client libraries. Trying to connect to a local queue manager will likely result in
an **MQRC_Q_MGR_NAME_ERROR** (2058) error.

To override this default behaviour and to permit use of local bindings connections, the
full MQ installation libraries must be used instead. There are two mechanisms to do this:
* Set the `MQIJS_NOREDIST` environment variable during `npm install` so that the Redist Client
package is not downloaded and installed in the `node_modules` directory.
* Set the `MQIJS_PREFER_INSTALLED_LIBRARY` environment variable at runtime

The use of the Redist Client libraries is preferred wherever possible, so that new function
can be introduced regardless of the version of MQ that has been "properly" installed on a machine.

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
* *Lookup()* extracts strings corresponding to MQI numbers, similar to the
*MQConstants.lookup()* method in Java.

## Requirements
* node version 10.20 or greater. Older versions will no longer work because
of requirements from the ffi-napi package
* On platforms other than Windows and Linux x64, you must also install
the MQ client package
* The package makes use of the `libffi` capabilities for direct access to the
MQ API. For some platforms the libffi and ffi-napi components may need
additional configuration before they can be build. That package is not available at all 
on z/OS - there is no way that this
package can run on that platform even with handcrafting build steps.

I have run it on Windows, where the NPM 'windows-build-tools' package
also needed to be installed first. See [this document](https://github.com/Microsoft/nodejs-guidelines/blob/master/windows-environment.md#environment-setup-and-configuration) for more information on Windows.

## Installation:
To install this package, you can pull it straight from the
NPM repository. You can also refer to it in a package.json file for
automatic installation.

~~~
mkdir <something>
cd <something>
npm install ibmmq
~~~

### Prerequisite components

Installation of the package will automatically install any
prerequisite packages downloadable from the npm repository. By
default, it will pull in packages listed in both the `dependencies` and the `devDependencies`
sections. For environments where you only want to run a program, then
adding an option `npm install --only=prod` or setting the `NODE_ENV` environment
variable to `production` will cause downloads of only the runtime dependencies.

### The MQ C Client libraries

The package also requires the MQ C client libraries to be installed/available.

For Windows and Linux x64, the npm installation process tries to access
the Redistributable Client packages and unpack them automatically. 

Note: IBM removes older levels of the Redistributable Client packages when
they become unsupported. If you want to continue to use older versions of
this package (which will reference those unsupported MQ versions) then you
will have to keep a local copy of the tar/zip files and unpack it as part
of your build process, using the MQIJS_* environment variables to control
installation and runtime.

If you do not want this automatic installation of the MQ runtime, then set the
environment variable `MQIJS_NOREDIST` to any value before running npm install.
The MQ libraries are then be found at runtime using mechanisms such as
searching `LD_LIBRARY_PATH` (Linux) or `PATH` (Windows).

The post-installation program will usually be pointing at the most recent Continuous Delivery
version of MQ (for example 9.1.4.0). These versions of MQ do not have fixpacks released. However
you can override both the version (VRM) and fixpack to be installed, assuming that full VRMF
level is still available for download. Setting the environment variables `MQIJS_VRM` and
`MQIJS_FIXPACK` will select a specific Redistributable Client package to be installed. Note that
installing an older VRM than the default in the current version of this package may not work, if
newer options have been introduced to the MQI. At the time of writing this paragraph, the latest
version of MQ was 9.2.0 (with no later CD releases), but there was also a 9.2.0.1 fixpack. If
you want to pick that up instead of the base 9.2.0 referred to in postinstall.js, then
set `MQIJS_FIXPACK=1` before running `npm install`. Once newer CD levels are available, then the
postinstall script will point at those instead by default.


### MacOS
The MQ client package for MacOS can be found at
[this site](http://public.dhe.ibm.com/ibmdl/export/pub/software/websphere/messaging/mqdev/mactoolkit).
Download a suitable version and install it in a local directory. The package is signed, and is not a
simple tar/zip format. The environment variable `DYLD_LIBRARY_PATH` then should be set to the
lib64 directory within that tree before running the program.

For example

`export DYLD_LIBRARY_PATH=/opt/mqm/lib64`

#### Errors and warnings during build
If you get an error message such as "gyp: No Xcode or CLT version detected" while
running `npm install` you may need to install the developer tools. Usually
the command `xcode-select --install` will deal with this.

You may also see a number of warnings from the C++ compiler as it compiles
some of the FFI prerequisite packages. While undesirable, there should be no
actual errors shown and the generated code does seem to work ok.

### Other platforms
For other MQ-supported platforms and environments, the C runtime can be
installed from your MQ installation media, or from the full Client downloads at
[this site](http://www-01.ibm.com/support/docview.wss?uid=swg24042176).

The Redistributable Client packages for Windows and Linux x64 are also available
directly from
[this site](http://public.dhe.ibm.com/ibmdl/export/pub/software/websphere/messaging/mqdev/redist).

As noted above, this package cannot run on z/OS as the prerequisite elements are not available there.

## Sample applications
See the samples [README](samples/README.md) file for more information about the sample programs.

## Containers

The samples directory includes a Dockerfile that can be used as the basis
of generating an independent container to run MQ programs. The **run.docker**
script builds and executes the container. Environment variables are used in
the Dockerfile and the script to control connection to the queue manager.

## Documentation

The package contains JSDoc comments that can be formatted using the **makedoc** script in the root directory. The generated documentation is then accessible
via a web browser.

## TypeScript

The package includes a set of type definitions, suitable for use with TypeScript programs. Some of the sample programs
have also been converted to use types. See the `samples/typescript` directory. These definitions have been tested with the
`tsc` compiler, the `ts-node` front-end, and inside the VSCode IDE.

The initial release of the these definitions should be considered a beta level, to gain feedback on the structure and
naming. It is possible that elements of the types will change in future.

### Bitwise vs Array Options fields

To help with syntax checking, many of the fields in the MQI that are normally set with bitwise operations (for example,
`pmo.Options = MQPMO_SYNCPOINT|MQPMO_NEW_CORREL_ID`) can now also be set using an array syntax such
as `pmo.Options = [MQPMO_SYNCPOINT, MQPMO_NEW_CORREL_ID]`. Once you make a choice in your application on which
style to use, you should stay consistent throughout the program. If input to an MQI function uses arrays, then the field
will still be an array on return from the function. It doesn't change shape within the MQI call. But sometimes you may still need
an explicit definition as the fields are defined as having either a number or an array type and the compiler may not know which it
is set to at some places when it needs to validate the code.

If you are using the array format, then any elements with the real value 0 will 
not show up in the array after an MQI call. For example, `MQPMO_NONE` would not be in the 
array following an MQPUT call even if you had set it in the original array.


Interrogating and modifying the options fields has to be done by being explicit about how the field is being used. For example,

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

and an example from the `amqsbra.ts`example where we use the bitwise operations to modify
a field:

```
  gmo!.Options = ((gmo!.Options as number) & ~MQC.MQGMO_BROWSE_FIRST);
  gmo!.Options = (gmo!.Options | MQC.MQGMO_BROWSE_NEXT);
```

## History

See [CHANGES](CHANGES.md).

## Health Warning

This package is provided as-is with no guarantees of support or updates. You cannot use
IBM formal support channels (Cases/PMRs) for assistance with material in this repository.

There are also no guarantees of compatibility with any future versions of the package; the API
is subject to change based on any feedback. Versioned releases are made in this repository
to assist with using stable APIs. Future versions will follow semver guidance so that breaking changes
will only be done with a new major version number.

## Issues and Contributions

For feedback and issues relating specifically to this package, please use the
[GitHub issue tracker](https://github.com/ibm-messaging/mq-mqi-nodejs/issues).

Contributions to this package can be accepted under the terms of the Developer's Certificate
of Origin, found in the [DCO file](DCO1.1.txt) of this repository. When
submitting a pull request, you must include a statement stating you accept the terms
in the DCO.


## Acknowledgements
Thanks to the IBM App Connect team for the initial implementation of the
asynchronous MQI variations. Their work has been adopted and adapted into
this library.

Thanks to Andre Asselin for the TypeScript definitions and sample program conversions.

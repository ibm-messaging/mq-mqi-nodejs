> Custom fork for NODE 12 with mqi.js downgraded to d9f345a6 - compat issues

# mq-mqi-nodejs
This repository demonstrates a way to call IBM MQ from applications
running in a Node.js environment.

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
Where there
are missing details within the verbs, these are shown by TODO
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
and `Get` - now have
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
See [here](https://www.ibm.com/support/knowledgecenter/en/SSFKSJ_9.0.0/com.ibm.mq.pro.doc/q130020_.htm#q130020___messagingapi) for more information.

These interfaces may be suitable for many messaging applications, even though
they do not give access to the full services available from MQ such as transactions.

## Unimplemented capabilities
All the application-level MQI verbs are now implemented.

There are no structure definitions for most MQ elements in message contents such
as the MQCIH structure. When putting messages, JavaScript Buffers and
strings can be used; when getting messages, data is always returned in a Buffer. T

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
* *GetDone()* is used to complete asynchronous retrieval of messages.
* *GetSync()* is equivalent of the traditional MQGET operation.
* *Lookup()* extracts strings corresponding to MQI numbers, similar to the
*MQConstants.lookup()* method in Java.

## Requirements
This package was developed using
* MQ V9.1 on Linux x64
* node version 8.16
* npm 6.12.0

I have run it on Windows, where the NPM 'windows-build-tools' package
also needed to be installed first.

### FFI package prereq change
Version 0.9.0 of this package has changed the prereq package used to
access the C libraries from "node-ffi" to "node-ffi-napi". The older
package appears to be unmaintained and does not work with node v10 unless
accessed directly from a git commit level. That level has not been pushed
to npm. The prereq change
should be transparent. However, if you are using the node v8 stream, then
you may see a message: "Warning: N-API is an experimental feature". This
warning is not produced from v8.12.0 onwards; it can also be suppressed via
the --no-warnings flag. The message is not generated for the v6 or v10
streams.

## Installation:
To install this package, you can pull it straight from the
NPM repository. You can also refer to it in a package.json file for
automatic installation.

~~~
mkdir <something>
cd <something>
npm install ibmmq
~~~

Installation of the package will automatically install any
prerequisite packages downloadable from the npm repository.

It also requires the MQ C client libraries to be installed/available.

For Windows and Linux x64, the npm installation process tries to access
the Redistributable Client packages and unpack them automatically. The
installation of this library succeeds even if the download and unpack of the
MQ runtime libraries fails in some way.

If you do not want this automatic installation of the MQ runtime, then set the
environment variable `MQIJS_NOREDIST` to any value before running npm install.
The MQ libraries are then be found at runtime using mechanisms such as
searching `LD_LIBRARY_PATH`.

For other MQ-supported platforms and environments, the C runtime can be
installed from your MQ installation media, or from the full Client downloads at [this site](http://www-01.ibm.com/support/docview.wss?uid=swg24042176).
The Redistributable Client packages for Windows and Linux x64 are also available
directly from [this site](http://public.dhe.ibm.com/ibmdl/export/pub/software/websphere/messaging/mqdev/redist).

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


## History

See [CHANGES](CHANGES.md).

## Health Warning

This package is provided as-is with no guarantees of support or updates.
There are also no guarantees of compatibility
with any future versions of the package. The API is subject to change based
on any feedback.

## Issues and Contributions

For feedback and issues relating specifically to this package, please use the
[GitHub issue tracker](https://github.com/ibm-messaging/mq-mqi-nodejs/issues).

Contributions to this package can be accepted under the terms of the
IBM Contributor License Agreement, found in the file [CLA.md](CLA.md) of this repository.
When submitting a pull request, you must include a statement stating
you accept the terms in the CLA.

## Acknowledgements
Thanks to the IBM App Connect team for the initial implementation of the
asynchronous MQI variations. Their work has been adopted and adapted into
this library.

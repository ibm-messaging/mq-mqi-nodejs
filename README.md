# mq-mqi-nodejs
This repository demonstrates a way to call IBM MQ from applications
running in a Node.js environment.

The initial release of this code is being done to encourage feedback, to
see if it is useful to continue with further development and how it
might be improved.

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

The most important MQI verbs and parameters are implemented here, with enough
function for many applications. Where there
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
All the verbs are essentially synchronous, even though they invoke callbacks
for any returned errors and information.
The exception to this is for getting messages from a queue.

This implementation includes two mechanisms for retrieving messages from
a queue:
* *GetSync()* is the call that does an MQGET(wait) synchronously. In a Node
environment, it blocks the execution thread until it completes. That may
be OK for an immediate retrieval where the wait time is set to zero,
but it is not recommended for any times where
you want to wait a while for a message to arrive.
* *Get()* is the call that works asynchronously. The callback
given as a parameter to this function is invoked truly asynchronously. To
stop the callback being called for further messages, use the *GetDone()* function.

Sample programs **amqsget** and **amqsgeta** demonstrate the two different
techniques. Note that *GetDone()* cannot be executed from
within the callback function itself; an exception is thrown. But it can
be scheduled for later execution.

## Alternative JavaScript routes into MQ
There are already some other ways to access MQ from Node.js:
* Take a look at
the [MQ Light](https://developer.ibm.com/messaging/mq-light/getting-started-mq-light/)
client available from [NPM](https://www.npmjs.com/package/mqlight). MQ supports
connections from MQ Light clients via AMQP channels.
* The MQTT protocol has an implementation [here](https://www.npmjs.com/package/mqtt). MQ supports
connections from MQTT clients via the XR service and Telemetry channels.
* MQ V9.0.4 includes a simple REST API for messaging that is accessible from any environment.
See [here](https://www-01.ibm.com/common/ssi/ShowDoc.wss?docURL=/common/ssi/rep_ca/0/897/ENUS217-420/index.html&request_locale=en) for more information.

These interfaces may be suitable for many messaging applications, even though
they do not give access to the full services available from MQ such as transactions.

## Unimplemented operations
Unimplemented MQI verbs include
* MQSET and MQINQ
* MQBEGIN
* All of the message property controls
* MQSUBRQ, MQSTAT
* MQCB/MQCTL are not directly exposed but wrapped under the *Get()* method.

There are no structure definitions for elements in message contents such
as the MQRFH2 or MQDLQ headers. When putting messages, JavaScript Buffers and
strings can be used; when getting messages,
data is always returned in a Buffer. The amqsget samples show one way
to convert that Buffer to a string for printing.

Only a local queue manager has been tested. Clients should work if defined via
CCDT or MQSERVER environment variable and the program sets the
MQCNO_CLIENT_BINDING flag in the MQCNO options during *Connx()*.
Programmatic controls for
client connectivity (the MQCD and MQSCO structures) have not been implemented
in this initial version.

## Extra operations
The package includes a couple of verbs that are not standard in the MQI.
* *GetDone()* is used to complete asynchronous retrieval of messages.
* *Lookup()* extracts strings corresponding to MQI numbers, similar to the
*MQConstants.lookup()* method in Java.

## Requirements
This package was developed using
* MQ V9 on Linux x64
* node version 6.11
* npm 3.10.10

## Installation:
To install the package, it needs to be cloned from GitHub and
then made available from the local node environment.

~~~
git clone https://github.com/ibm-message/mq-mqi-nodejs <directory>
cd <directory>/lib
npm link        # This may require root permissions.
~~~

Installation of the package will automatically install any
prerequisite packages downloadable from the npm
repository.

This package is not, for now, being pushed to the npm repository.
That may happen when it has had more testing and more stability, and
depending on feedback.

## Sample applications
Samples are provided to put and get messages, and subscribe to
topics. The source code of these samples should be reviewed for
an fuller idea of how this package can be used.

The sample applications use, by default, a local queue manager QM1
and ability to
use SYSTEM.DEFAULT.LOCAL.QUEUE or the topic SYSTEM.DEFAULT.TOPIC.
These values can be overridden on the command line.

The **amqsput** sample shows how to fill in authentication options with
userid and password values.

The two **amqsget** samples show use of synchronous and asynchronous
APIs for retrieving messages.

Run like:

~~~
cd <directory>/samples
setmqenv -m <qmgr> -k     # to make sure MQ libraries can be found
npm link ibmmq
node amqsput.js
node amqsget.js
~~~

## History

25 October 2017
 * Version 0.1.0 : Initial release

## Health Warning

This package is provided as-is with no guarantees of support or updates.
There are also no guarantees of compatibility
with any future versions of the package; the API is subject to change based
on any feedback.

## Issues and Contributions

For feedback and issues relating specifically to this package, please use the
[GitHub issue tracker](https://github.com/ibm-messaging/mq-mqi-nodejs/issues).

Contributions to this package can be accepted under the terms of the
IBM Contributor License Agreement, found in the file CLA.md of this repository.
When submitting a pull request, you must include a statement stating
you accept the terms in CLA.md.

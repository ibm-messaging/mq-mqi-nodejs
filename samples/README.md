# Sample program information
Files in this directory are samples to demonstrate use of the Node.js interface to IBM MQ.

You can run them individually using `node <program>.js` with any additional
required or optional parameters on the command line. Look at the source code to see
which configuration values can be changed.

Make sure you first read the README in the root of this repository to set up an environment
where Node.js programs can be executed, and how the packages refer to the MQ interfaces.

Samples are provided to demonstrate most MQI uses, including ways put and get
messages, and to subscribe to topics. The source code of these samples should be reviewed for
an fuller idea of how this package can be used.

## Default values
Where needed for the sample programs:

* the default queue manager is "QM1"
* the default queue is "DEV.QUEUE.1"
* the default topic is based on "DEV.BASE.TOPIC" (under dev/... tree)

## Description of sample programs
Current samples in this directory include

* amqsput  : Put a single message to a queue
* amqsputp : Put a single message to a queue using Promises for the MQ verbs
* amqsget  : Get all the messages from a queue synchronously.
* amqsgeta : Get all the messages from a queue using asynchronous retrieval. Optionally get a specific message by its id
* amqsbra  : Non-destructive browse of messages on a queue
* amqspub  : Publish to a topic
* amqssub  : Subscribe to a topic and receive publications
* amqsconn : How to programmatically connect as an MQ client to a remote queue manager.
Allow use of a userid/password for authentication. There are no default values for this sample.
* amqsconntls : Programmatically create the connection using a TLS-enabled channel
* amqsprop : Set and extract message properties
* amqsinq  : Demonstrate how to inquire about object attributes
* amqsset  : Demonstrate how to set attributes of an MQ object using the MQSET verb
* amqsdlh  : Demonstrate how to set and parse the Dead Letter Header on messages


## Running the programs
Apart from the `amqsconn` and `amqsconntls` programs, the other samples are designed to either connect
to a local queue manager (on the same machine) or for the client configuration to be
provided externally such as by the MQSERVER environment variable or the
MQ Client Channel Definition Table (CCDT) file. The MQ_CONNECT_TYPE environment
variable can be used to force client connections to be made, even if you have
installed the full server product; that variable is not needed if you have
only installed the MQ client libraries.

Run like:

~~~
cd <something>/node_modules/ibmmq/samples
. setmqenv -s  -k     # to make sure MQ libraries can be found

node amqsput.js
node amqsget.js
~~~

There are various forms of the setmqenv command parameters, depending on your
environment and platform. This is just one example; read the KnowledgeCenter for
more options if you need them.

### Working with NPM
You may need to run `npm link` or `npm link ibmmq` from the samples directory or
the root of the repository if the program cannot find the ibmmq module. See
the [npm documentation](https://docs.npmjs.com/cli/link.html) for more information.

## More information
Comments in the programs explain what they are doing. For more detailed information about the
MQ API, the functions, structures, and constants, see the
[MQ Knowledge Center](https://www.ibm.com/support/knowledgecenter/en/SSFKSJ_9.1.0/com.ibm.mq.ref.dev.doc/q089590_.htm).

You can also find general MQ application development advice [here](https://www.ibm.com/support/knowledgecenter/en/SSFKSJ_9.1.0/com.ibm.mq.dev.doc/q022830_.htm).
Information about development for procedural programming languages such as C in that
documentation is most relevant for the interface exported by this Go package.

# Changelog
Newest updates are at the top of this file.

## 26 Mar 2019 : v0.9.5
* Make core verbs truly asynchronous with alternative synchronous variants
  * Breaking API: Open(Sync) and Sub(Sync) no longer return objects. Must use callback.
  * Callback function for Get() now invoked with additional MQQueueManager parameter (as last parm, to avoid breaking API).
* Update for MQ V9.1.2 definitions
* MQ V9.1.2 allows setting of application name
* Add MacOS ("darwin") definitions
* Change samples to use Developer edition default objects such as DEV.QUEUE.1

## 24 Nov 2018 : v0.9.2
* Update for MQ V9.1.1 definitions

## 16 Oct 2018 : v0.9.1
* Environment variable MQIJS_NOREMOVE to preserve all extracted files in MQ client package for debug purposes
* Environment variable MQIJS_NOREMOVE_DOWNLOAD to preserve tar/zip file of MQ client package for debug purposes

## 01 Oct 2018 : v0.9.0
* Switch to using ffi-napi as alternative library since ffi appears unmaintained.

## 28 Aug 2018 : v0.8.6
* Change how fairness tuning is done for heavy workloads
* Removal of exported getLoopIntervalMs value; use setTuningParameters() instead

## 22 Aug 2018 : v0.8.5
* Add some more definitions to MQI constants
* Experimental message element generator/parser for MQDLH structure
* New sample amqsdlh to put message with Dead Letter Header

## 10 Aug 2018 : v0.8.2
* This version not released to NPM
* Separate MQI definition files by platform
* Implement some "fairness" heuristics for dealing with lots of queues or very deep queues
* New verb setMaxConsecutiveGets to modify default fairness attribute

## 03 Aug 2018 : v0.8.1
* Update for MQ 9.1.0 client and definitions

## 23 Jul 2018 : v0.8.0
* Use a git-level instead of npm for ffi package to get it working on Node 10
* Added sample to show programming TLS connections in client

## 06 Jun 2018 : v0.7.1
* Use smaller base image for container
* Keep runmqsc in redist package

## 23 May 2018 : v0.7.0
* Add sample for building Docker container

## 22 May 2018 : v0.6.1
* Try to automatically load the C client library during npm install

## 09 May 2018 : v0.5.2
* Allow hostname:port format for ConnectionName in client MQCD

## 26 Mar 2018 : v0.5.0
* Added V9.0.5 MQI constants

## 02 Feb 2018 : v0.4.1
* Added sample for MQCONN.
* Test that C client is installed

## 04 Jan 2018 : v0.3.7
* Modified some of the new async retrieval design

## 02 Jan 2018 : v0.3.5
* Had to redesign async retrieval to avoid deadlocks in queue manager code
* Added makedoc script to generate JSDoc output

## 20 Dec 2017 : v0.3.0
* Added the message properties calls

## 15 Dec 2017 : v0.2.3
* Added MQSTAT

## 12 Dec 2017 : v0.2.2
* Redesigned MQSET/MQINQ interface to be much simpler

## 08 Dec 2017 : v0.2.1
* Added support for MQSUBRQ, MQSET and MQINQ verbs.
* Documentation improvements

## 30 November 2017 : v0.2.0
* Added MQSCO and MQCD structures for client programmatic access

## 24 November 2017 : v0.1.4
* Fixed some CNO fields; added support for client CCDTUrl

## 21 November 2017 : v0.1.3
* Fixed async get when events returned in callback

## 16 November 2017 : v0.1.2
* Pushed to NPM. No code changes.

## 08 November 2017 : v0.1.1
* Updates for Windows and package layout

## 25 October 2017 : v0.1.0
* Initial release

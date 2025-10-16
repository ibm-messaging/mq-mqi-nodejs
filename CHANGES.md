# Changelog
Newest updates are at the top of this file.

## 16 Oct 2025: v2.1.6
* Update for MQ 9.4.4
* Added DEPRECATIONS.md to notify of planned future changes

## 16 Jun 2025: v2.1.5
* Update for MQ 9.4.3
* samples - amqsjwt to use clientId/secret instead of userid/password

## 15 Apr 2025: v2.1.4
* Fix a potential deadlock under load

## 28 Feb 2025: v2.1.3
* Update for MQ 9.4.2
* Deal better with callbacks on "wrong" hObj
* Various linter-suggested updates
* Move away from DockerHub as default location for container images

## 28 Oct 2024: v2.1.2
* Fix some missing TypeScript definitions
* Remove eslint dependencies from package.json

## 24 Oct 2024: v2.1.1
* Update for MQ 9.4.1
  * Fields in MQSCO structure
* New module for instrumenting applications for OpenTelemetry Tracing 
* Merge fix for MQRFH2.getBuffer (#185)

## 19 Jun 2024: v2.1.0
* Update for MQ 9.4.0
* Postinstall script checks that unpacking program is available

## 15 May 2024: v2.0.4
* Fixes for unexpected MQRC_HCONN_ASYNC_ACTIVE (#179)
* Build problems on latest MacOS compiler (#181)
* Code cleanup from linter
* Base Node engine of 18.20

## 28 Feb 2024: v2.0.3
* Update for MQ 9.3.5
* Add sample showing JWT Token Authentication
* Deal with event callbacks from Client library (#173)
* Allow env vars for postinstall to be read from .npmrc (#176)

## 19 Oct 2023: v2.0.2
* Update for MQ 9.3.4
  - Support for JWT Token authentication
* Change the postinstall to use genmqpkg on Linux
* Can configure postinstall to download client from local URL
* Updated postinstall to support http proxy environment variables (#167)
* Fix calling the MQI within message delivery callback (#169)  
* Update documentation links

## 05 Jul 2023: v2.0.1 
* Added LinuxARM definitions
* Fix TLS channels not using correct structure version

## 25 Jun 2023: v2.0.0 
* Published to npm
* See BREAKING_CHANGES.md for notes on application changes
  - Any future updates will be based on this stream
* Update for MQ 9.3.3
* Update various dependency versions

## 21 Jun 2023: v1.0.6
* Update for MQ 9.3.3
* Update various dependency versions
* Final 1.x release 

## 15 Feb 2023: v1.0.5
* Update for MQ 9.3.2
* Update various dependency versions

## 07 Jan 2023: v1.0.4
* Fix typescript declaration (#152) 
* Fix more missing MQCA_ checks
* Add internal trace option for most functions

## 16 Nov 2022: v1.0.3
* Fix missing MQCA_ checks #150
* Replace CLA with DCO file
 
## 21 Oct 2022: v1.0.2
* Update for MQ 9.3.1
* Update various dependency versions
* Postinstall script deletes more unnecessary files

# 01 Aug 2022: v1.0.1
* Merge #145
* Update various dependency versions

## 23 Jun 2022: v1.0.0 
* Update for MQ 9.3.0
* Add MQI parameters for keystore passwords
* Update various dependency versions

## 13 Apr 2022: v0.9.23
* Pull in #140 fix

## 25 Feb 2022: v0.9.22
* Update for MQ 9.2.5

## 26 Jan 2022: v0.9.21
* Add array syntax for setting Options fields in MQI structures as alternative to bitwise operators
* Minor corrections to the TypeScript definitions and samples

## 11 Jan 2022: v0.9.20
* Added TypeScript definition files (#132)
* Added some missing definitions in mqidefs

## 19 Nov 2021: v0.9.19
* Update for MQ 9.2.4
* New MQBNO structure for Uniform Cluster balance control
* Add sample Dockerfile based around Red Hat UBI containers
* Better reporting of MacOS dynamic loading

## 03 Aug 2021: (no new version)
* Update sample Dockerfile to split into separate build/run images

## 23 Jul 2021 : v0.9.18
* Update for MQ 9.2.3
* Fix RFH2 structure (#125)
* Use unlinkSync in postinstall (#127)

## 26 Mar 2021 : v0.9.17
* Update for MQ 9.2.2
* Don't delete runmqakm from Redist package
* Update ref-napi, ffi-napi to get fix for #108

## 02 Dec 2020 : v0.9.16
* Update for MQ 9.2.1
* Allow override of VRM and fixpack levels
* Update URLs to KnowledgeCenter to point at "latest" instead of specific version
* Use explicit strings for platform variant 'require' (#104)
* Recommend (but not enforce) Node v14 as preferred level during install (#100)

## 25 July 2020 : v0.9.15
* Update for MQ 9.2.0

## 20 May 2020 : v0.9.14
* Add support for Node 14
  * Various dependencies updated
* Remove support for Node 8

## 03 Apr 2020 : v0.9.13
* Add support for Hdr/Msg Compression in MQCD
* Update for MQ V9.1.5

## 15 Jan 2020 : v0.9.12
* Add Promises for most core verbs
* Correct version number for SCO structure

## 05 Dec 2019 : v0.9.11
* Update for MQ V9.1.4

## 30 Oct 2019 : v0.9.10
* Calling Get after a GetDone should now properly resume processing

## 28 Oct 2019 : v0.9.9
* Changes to how the MQ C libraries are accessed.
  * Make the Redist Client libraries the default mechanism
  * Use environment variable MQIJS_PREFER_INSTALLED_LIBRARY to choose installed (eg /opt/mqm) path instead
* Add RFH2 processing to amqsget sample

## 22 Jul 2019 : v0.9.8
* Update for Node 12 - various dependencies replaced
* Fixed a memory problem in MQINQMP
* Added partial parser for RFH2 structure header (fixed portion)

## 03 Jul 2019 : v0.9.6
* Update for MQ V9.1.3 definitions

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

# 16 Oct 2018 : v0.9.1
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

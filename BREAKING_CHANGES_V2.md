# Incompatibilities with previous versions

This document describes incompatibilities between the V0.x/V1.x releases
of the `ibmmq` package and V2.x.

In general, the API has not changed. The provided sample programs have not
needed modification other than as noted below for message consumers.

## Installation
There should be no real changes to installation (`npm install`), except that it is now more likely
that the C++ compilation of native code needs to be done. While some prebuilt modules
are provided, these may not cover as many platforms as the previous dependency chain
supplied. So you will need the compile tools associated with npm/node to be available.

On Windows, these are readily installed as a tick-box option when you install node itself.

## Asynchronous message delivery
A large internal change is the implementation of message delivery (`MQGET`) for asynchronous
processing. The code now uses MQ-provided APIs to achieve the asynchrony instead of 
emulating it in the JavaScript layer. But this has some knock-on effects. There was no clean way
to provide 100% compatibility with old applications, so you may have to make application or
environment changes. And the new major version number of the package gives that hint as it implies
potential breaking changes.

### Starting message consumption
The default behaviour now is that applications wanting to asynchronously consume messages (the `Get()`
verb) have to add a further call to the new `Ctl()` verb after setting up the callback invoked
on message arrival. This allows you to setup callbacks for many different queues in advance of any
delivery starting. The `amqsgetac.js` sample demonstrates this approach. 

If you have existing MQ Node.js applications, then you can either add the `Ctl()` call or revert to 
the previous behaviour with an environment variable (`MQIJS_NOUSECTL` - any non-null value) or 
setting a tuning parameter (`tuningParameters.useCtl=false`). If you do not take either of these actions, then
no messages will be delivered.

The `Ctl()` verb is the analogue of the underlying `MQCTL` and allows message consumption to be started,
suspended or resumed across an `hConn`. Changes to the message consumers, for example if you now want to 
get messages for an additional queue, must be made after calling `Ctl(MQOP_SUSPEND)` followed by a `MQOP_RESUME`.

No changes are needed for applications using `GetSync()` for message retrieval.

### Dynamically changing GMO/MD options
The previous version allowed you to modify MQGMO and MQMD options in the callback function when receiving messages.
In particular, the `amqsbra` sample flipped between `MQGMO_BROWSE_FIRST` and `MQGMO_BROWSE_NEXT`. That is no longer
possible - in fact, it's not possible in the underlying MQI and should never have been permitted in this Node.js wrapper.
For that particular sample program, always using `MQGMO_BROWSE_NEXT` is sufficient anyway. Instead, you should call a 
sequence of `Ctl(MQOP_SUSPEND)`, `Close()`, `Open(new options)`, `Ctl(MQOP_RESUME)`.

## TuningParameters
Some of the `tuningParameter` options have been removed. They controlled behaviour of the previous emulation
of asynchronous `MQGET`. Applications which try to use these removed fields will receive a failure or exception when
setting the values: `getLoopPollTimeMs`, `syncMQICompat`. New tuning options are available: `callbackStrategy` (might be
useful for workload spreading across multiple queues) and `useCtl` (discussed above).
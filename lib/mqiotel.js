"use strict";
/*
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.

  Contributors:
    Mark Taylor   - Initial Contribution

*/

/*
 * A component to handle OpenTelemetry Trace propagation.
 * Take the context from the Node application and put it
 * into an MQ message property for onward transfer. Do the
 * same in reverse for inbound messages.
 *
 * We know that the ibmmq module treats the property/handle MQI
 * functions as synchronous. So we don't need to worry about
 * multiple threads accessing structures simultaneously. Or
 * do locking. All of these functions end up being synchronous.
 */

const util = require("util");

const MQC = require("./mqidefs.js");
const mqod = require("./mqod.js");

const mqmpo = require("./mqmpo.js");
const mqmho = require("./mqmho.js");
const mqstruc = require("./mqstruc.js");
const mqt = require("./mqitypes.js");

const log = require("./mqilogger.js");

let init = false;
let envHasOtel = false;
let otelApi;

// This map holds an hMsg for each hConn that can be used for all PUTs and synchronous
// GETs. Async GETs will use handles based off the hObj, but stored in the same map. The
// key will either be "hConnInteger/*" or "hConnInteger/hObjInteger"
const objectHandleMap = new Map();

// This map holds the GMO Options used during a GET, so we can restore the user's value
// after we've used any extra flags such as using a MsgHandle. It also holds the queue's
// PROPCTL value if we can discover it
const objectOptionsMap = new Map();

// An object that will hold function references back to the main mqi.js module to
// avoid 'require' cycles
const mq = {};

// Grab some MQ structures that are needed for the property calls but which do not actually
// change once allocated.
const impo = new mqmpo.MQIMPO();
const smpo = new mqmpo.MQSMPO();
// const dmpo = new mqmpo.MQDMPO(); // Not used at the moment

const pd = new mqmpo.MQPD();

const cmho = new mqmho.MQCMHO();
const dmho = new mqmho.MQDMHO();

// Big enough buffer to hold the trace property info when queried via MQINQMP
const propBuf = Buffer.alloc(10240);

// Use this as a bitmap filter to pull out relevant value from GMO.
// The AS_Q_DEF value is 0 so would not contribute.
const getPropsOptions = MQC.MQGMO_PROPERTIES_FORCE_MQRFH2 |
    MQC.MQGMO_PROPERTIES_IN_HANDLE |
    MQC.MQGMO_NO_PROPERTIES |
    MQC.MQGMO_PROPERTIES_COMPATIBILITY;

// Options in an MQOPEN that mean we might do MQGET
// Do not include BROWSE variants
const openGetOptions = MQC.MQOO_INPUT_AS_Q_DEF |
    MQC.MQOO_INPUT_SHARED |
    MQC.MQOO_INPUT_EXCLUSIVE;

// The names of the properties to set in the <usr> folder of the RFH2 for propagation
const traceparent = "traceparent";
const tracestate = "tracestate";

// Set this so any underlying equivalent code in the C library will not try to do its own thing
process.env.AMQ_OTEL_INSTRUMENTED = "true";

// Are there any OTEL modules in the environment? If not, then
// we can ignore everything else here. The API module is the
// important one as that gets access to the methods we will be using.
// This module can also be bypassed by setting the MQIJS_NOOTEL environment variable.
function doOtelSetup() {
    log.traceEntry("doOtelSetup");
    if (!process.env.MQIJS_NOOTEL) {
        const keys = Object.keys(require("module")._cache);
        for (let i = 0; i < keys.length; i++) {
            // log.debug("imported: %s",keys[i]);
            if (keys[i].includes("@opentelemetry/api/")) {
                envHasOtel = true;
                otelApi = require("@opentelemetry/api");
                // log.debug("otelApi: %o", otelApi);
                break;
            }
        }
    }
    init = true;
    log.debug(util.format("App has Otel modules %s", envHasOtel ? "available" : "unavailable"));
    log.traceExit("doOtelSetup");
}

// Create a key for accessing maps
// Optional hObj for where we need different handles for each queue
function hcKey(hc, ho) {
    // Get the actual hConn value from an hConn object
    let suffix = "*";
    if (ho) {
        suffix = ho._hObj;
    }
    const k = hc._hConn + "/" + suffix;
    log.debug("hcKey returning %s", k);
    return k;
}

// Do we have a MsgHandle for this hConn? If not, create a new one
function getMsgHandle(hConn, hObj) {
    const mh = objectHandleMap.get(hcKey(hConn, hObj));
    if (!mh) {
        mq.mqi.CrtMh(hConn, cmho, function (err, mhi) {
            if (!err) {
                objectHandleMap.set(hcKey(hConn, hObj), mhi);
            } else {
                log.error(err);
            }
        });
    }
    return objectHandleMap.get(hcKey(hConn, hObj));
}

// Is the GMO/PMO MsgHandle one that we allocated?
function compareMsgHandle(hConn, hObj, mh) {
    let rc = false;
    if (objectHandleMap.has(hcKey(hConn, hObj))) {
        const mhLocal = objectHandleMap.get(hcKey(hConn, hObj));
        if (mhLocal == mh) {
            rc = true;
        }
    }
    return rc;
}

// Delete all msghandles associated with a connection.
// This should be called during MQDISC
function dltHandles(hConn) {
    let keys = objectHandleMap.keys();
    for (let i = 0; i < keys.length; i++) {
        const prefix = hConn._hConn + "/";
        if (keys[i].startsWith(prefix)) {
            const mh = objectHandleMap.get(keys[i]);
            if (mh) {
                mq.mqi.DltMh(hConn, mh, dmho, function (e) {
                    // Ignore any failure
                });
                objectHandleMap.delete(keys[i]);
            }
        }
    }

    // And delete information about any OPENed object too
    keys = objectOptionsMap.keys();
    for (let i = 0; i < keys.length; i++) {
        const prefix = hConn._hConn + "/";
        if (keys[i].startsWith(prefix)) {
            objectOptionsMap.delete(keys[i]);
        }
    }
}

// Check if an app-supplied message handle is usable
function validHandle(mh) {
    let rc = false;
    if (mh && mh != MQC.MQHM_NONE && mh != MQC.MQHM_UNUSABLE_HMSG) {
        rc = true;
    }
    return rc;
}

// Is there a property of the given name?
function propsContain(hConn, mh, prop) {
    let rc = false;

    impo.Options = MQC.MQIMPO_CONVERT_VALUE | MQC.MQIMPO_INQ_FIRST;
    log.traceExit("openInq");
    // Don't care about the actual value of the property, just that
    // it exists.
    mq.mqi.InqMp(hConn, mh, impo, pd, prop, propBuf, function (err, n, v, t) {
        if (!err) {
            rc = true;
        }
    });
    return rc;
}

// Called after a successful MQOPEN by the application so we can do an MQINQ
// to determine the PROPCTL value in case it affects how we do the MQGET processing
function openAfter(hConn, hObj, od, openOptions) {
    log.traceEntry("openAfter");
    if (!init) {
        doOtelSetup();
    }

    // Does this app already have OTEL modules loaded? If not,
    // then we don't add anything
    if (!envHasOtel) {
        log.traceExit("openAfter");
        return;
    }

    // Do the MQINQ and stash the information
    // Only care if there's an INPUT option. We do the MQINQ on every relevant MQOPEN
    // because it might change between an MQCLOSE and a subsequent MQOPEN. The MQCLOSE
    // will, in any case, have discarded the entry from this map.
    if ((od.ObjectType == MQC.MQOT_Q) && (openOptions & openGetOptions) != 0) {
        const key = hcKey(hConn, hObj);

        let propCtl = 0;
        const selectors = [new mqt.MQAttr(MQC.MQIA_PROPERTY_CONTROL)];
        const inqOd = new mqod.MQOD();
        inqOd.ObjectName = od.ObjectName;
        inqOd.ObjectQMgrName = od.ObjectQMgrName;
        inqOd.ObjectType = MQC.MQOT_Q;
        const inqOpenOptions = MQC.MQOO_INQUIRE;
        log.debug("openAfter: pre-OpenSync");
        // This gets a little recursive as OpenSync will end up calling back into this function. But
        // as it's only doing MQOO_INQUIRE, then we don't nest any further
        if (openOptions & MQC.MQOO_INQUIRE) {
            log.debug("Reusing hObj for MQINQ");
            try {
                mq.mqi.Inq(hObj, selectors);
                log.debug("openAfter: Inq err return: %o", selectors);
                propCtl = selectors[0].value;
            } catch (err) {
                log.debug("openAfter: Inq err %o", err);
                propCtl = -1;
            }
        } else {
            log.debug("Creating new hObj for MQINQ");
            mq.mqi.OpenSync(hConn, inqOd, inqOpenOptions, function (err, inqhObj) {
                log.debug("openAfter: OpenSync err %o", err);

                if (err) {
                    propCtl = -1;
                } else {
                    try {
                        mq.mqi.Inq(inqhObj, selectors);
                        log.debug("openAfter: Inq err return: %o", selectors);
                        propCtl = selectors[0].value;
                    } catch (err) {
                        log.debug("openAfter: Inq err %o", err);
                        propCtl = -1;
                    }

                    mq.mqi.CloseSync(inqhObj, 0, function (err) {
                        log.debug("openAfter: Close err %o", err);
                        // Ignore error
                    });
                }
            });
        }

        // Create an object to hold the value. Other fields might be
        // added to the object if necessary.
        const options = { propCtl: propCtl };
        // replace any existing value for this object handle
        objectOptionsMap.set(key, options);
    } else {
        log.debug("openAfter: not doing Inquire ");
    }

    // log.debug("openAfter: objectMap: %o",objectOptionsMap);
    log.traceExit("openAfter");
    return;
}

// Cleanup after an MQCLOSE
function closeAfter(hObj) {
    const key = hcKey(hObj._mqQueueManager, hObj);
    if (objectOptionsMap.has(key)) {
        objectOptionsMap.delete(key);
    }
}

// During an MQPUT/PUT1, set the properties needed to propagate
// the application's current span/context
function putTraceBefore(hConn, md, pmo, msg) {
    log.traceEntry("putTraceBefore");
    if (!init) {
        doOtelSetup();
    }

    // Does this app already have OTEL modules loaded? If not,
    // then we don't add anything
    if (!envHasOtel) {
        log.traceExit("putTraceBefore");
        return;
    }

    let mh;
    let mho;
    let skipParent = false;
    let skipState = false;

    // Is the app already using a MsgHandle for its PUT? If so, we
    // can piggy-back on that. If not, then we need to use our
    // own handle. That handle can be reused for all PUTs/GETs on this
    // hConn. This works, even when the app is primarily using an RFH2 for
    // its own properties - the RFH2 and the Handle contents are merged.
    //
    // If there was an app-provided handle, then have they set
    // either of the key properties? If so, then we will
    // leave them alone as we are not trying to create a new span in this
    // layer.
    if (validHandle(pmo.NewMsgHandle)) {
        mh = pmo.NewMsgHandle;
        if (propsContain(hConn, mh, traceparent)) {
            skipParent = true;
        }
        if (propsContain(hConn, mh, tracestate)) {
            skipState = true;
        }
    } else if (validHandle(pmo.OriginalMsgHandle)) {
        mho = pmo.OriginalMsgHandle;
        if (propsContain(hConn, mho, traceparent)) {
            skipParent = true;
        }
        if (propsContain(hConn, mho, tracestate)) {
            skipState = true;
        }
    } else {
        mh = getMsgHandle(hConn, null);
        pmo.OriginalMsgHandle = mh;
    }

    // Make sure we've got one of the handles set
    if (mho && !mh) {
        mh = mho;
    }

    // The message MIGHT have been constructed with an explicit RFH2
    // header. Unlikely, for a Node app, but possible. If so, then we extract the properties
    // from that header (assuming there's only a single structure, and it's not
    // chained). Then very simply look for the property names in there as strings. These tests would
    // incorrectly succeed if someone had put "traceparent" into a non-"usr" folder but that would be
    // very unexpected.
    if (md.Format == MQC.MQFMT_RF_HEADER_2) {
        const hdr = mqstruc.MQRFH2.getHeader(msg);
        const props = mqstruc.MQRFH2.getAllProperties(hdr, msg);

        for (let i = 0; i > props.length; i++) {
            const propEntry = props[i];
            if (propEntry.includes("<" + traceparent + ">")) {
                skipParent = true;
                break;
            }
        }

        for (let i = 0; i > props.length; i++) {
            const propEntry = props[i];
            if (propEntry.includes("<" + tracestate + ">")) {
                skipState = true;
                break;
            }
        }
    }

    // We're now ready to extract the context information and set the MQ message property
    // We are not going to try to propagate baggage via another property
    const span = otelApi.trace.getSpan(otelApi.context.active());

    if (span) {
        log.debug("About to extract context from an active span");
        // log.debug("Span: %o",span);
        if (!skipParent) {
            const traceId = span.spanContext().traceId;
            const spanId = span.spanContext().spanId;
            const traceFlags = span.spanContext().traceFlags;

            // This is the W3C-defined format for the trace property
            const value = util.format("%s-%s-%s-%s", "00", traceId, spanId, ((traceFlags == 1) ? "01" : "00"));
            log.debug("Setting %s to %s", traceparent, value);
            mq.mqi.SetMp(hConn, mh, smpo, traceparent, pd, value, function (err) {
                if (err) {
                    // Should we throw, or fail silently?
                    log.error(err);
                    // throw err;
                }
            });
        }

        if (!skipState) {
            // Need to convert any traceState map to a single serialised string
            const ts = span.spanContext().traceState;
            if (ts) {
                const value = ts.serialize();
                log.debug("Setting %s to %s", tracestate, value);
                mq.mqi.SetMp(hConn, mh, smpo, tracestate, pd, value, function (err) {
                    if (err) {
                        // Should we throw, or fail silently?
                        log.error(err);
                        // throw err;
                    }
                });
            }
        }
    }

    log.traceExit("putTraceBefore");

}

// If we added our own MsgHandle to the PMO, then remove it
// before returning to the application. We don't need to delete
// the handle as it can be reused for subsequent PUTs on this hConn
function putTraceAfter(hConn, pmo) {
    log.traceEntry("putTraceAfter");

    if (!envHasOtel) {
        log.traceExit("putTraceAfter");
        return;
    }

    const mh = pmo.OriginalMsgHandle;
    if (compareMsgHandle(hConn, null, mh)) {
        pmo.OriginalMsgHandle = BigInt(MQC.MQHM_NONE);
    }
    log.traceExit("putTraceAfter");

}

// Setup any message handle needed for the MQGET/MQCB based
// on how the application is working. For GetSync, hObj is
// passed as null as we can use the same handle for PUTs. For
// GetAsync, we will use a separate handle for each hObj to avoid
// parallel callbacks getting confused.
function getSyncTraceBefore(hConn, hObj, gmo) {
    return getTraceBefore(hConn, hObj, gmo, false);
}
function getAsyncTraceBefore(hConn, hObj, gmo) {
    return getTraceBefore(hConn, hObj, gmo, true);
}

function getTraceBefore(hConn, hObj, gmo, async) {
    log.traceEntry("getTraceBefore");
    if (!init) {
        doOtelSetup();
    }

    if (!envHasOtel) {
        log.traceExit("getTraceBefore");
        return;
    }

    // Option combinations:
    // MQGMO_NO_PROPERTIES: Always add our own handle
    // MQGMO_PROPERTIES_IN_HANDLE: Use it
    // MQGMO_PROPERTIES_COMPAT/FORCE_RFH2: Any returned properties will be in RFH2
    // MQGMO_PROPERTIES_AS_Q_DEF:
    //      PROPCTL: NONE: same as GMO_NO_PROPERTIES
    //               ALL/COMPATV6COMPAT: Any returned properties will be either in RFH2 or Handle if supplied
    //               FORCE: Any returned properties will be in RFH2
    const propGetOptions = gmo.Options & getPropsOptions;
    if (validHandle(gmo.MsgHandle)) {
        log.debug("Using app-supplied msg handle");
    } else {
        const key = hcKey(hConn, hObj);
        let propCtl = -1;
        let opts = objectOptionsMap.get(key);
        if (opts) {
            propCtl = opts.propCtl;
            // Stash the GMO options so they can be restored afterwards
            opts.gmo = gmo.Options;
            objectOptionsMap.set(key, opts);
        }

        // If we know that the app or queue is configured for not returning any properties, then we will override that into our handle
        if ((propGetOptions == MQC.MQGMO_NO_PROPERTIES) || (propGetOptions == MQC.MQGMO_PROPERTIES_AS_Q_DEF && propCtl == MQC.MQPROP_NONE)) {
            gmo.Options &= ~MQC.MQGMO_NO_PROPERTIES;
            gmo.Options |= MQC.MQGMO_PROPERTIES_IN_HANDLE;
            gmo.MsgHandle = getMsgHandle(hConn, async ? hObj : null);
            log.debug("Using mqiotel msg handle. getPropsOptions=%d propCtl=%d", propGetOptions, propCtl);
        } else {
            // Hopefully they will have set something suitable on the PROPCTL attribute
            // or are asking specifically for an RFH2-style response
            log.debug("Not setting a message handle. getPropsOptions=%d", propGetOptions);
        }
    }

    log.traceExit("getTraceBefore");

}

// Extract the properties from the message, either with the properties API
// or from the RFH2. Construct an object with the span information.
// We do not try to extract/propagate any baggage-related fields.
function getTraceAfter(hConn, hObj, gmo, md, msg, async, otelOpts) {
    let traceparentVal;
    let tracestateVal;
    let removed = 0;

    log.traceEntry("getTraceAfter");

    if (!envHasOtel) {
        log.traceExit("getTraceAfter");
        return 0;
    }

    log.debug("OtelOpts: %o", otelOpts);

    const mh = gmo.MsgHandle;
    if (validHandle(mh)) {

        impo.Options = MQC.MQIMPO_CONVERT_VALUE | MQC.MQIMPO_INQ_FIRST;

        mq.mqi.InqMp(hConn, mh, impo, pd, traceparent, propBuf, function (err, n, v, type) {
            if (!err) {
                log.debug("Found traceparent property: %s", v);
                traceparentVal = v;
            } else {
                if (err.mqrc != MQC.MQRC_PROPERTY_NOT_AVAILABLE) {
                    log.error(err);
                }
            }
        });

        mq.mqi.InqMp(hConn, mh, impo, pd, tracestate, propBuf, function (err, n, v, type) {
            if (!err) {
                log.debug("Found tracestate property: %s", v);
                tracestateVal = v;
            } else {
                if (err.mqrc != MQC.MQRC_PROPERTY_NOT_AVAILABLE) {
                    log.error(err);
                }
            }
        });

        // If we added our own handle in the GMO, then reset
        // but don't do it for Async loops. Can use the hObj to
        // discriminate between sync and async variations.
        if (!async && compareMsgHandle(hConn, async ? hObj : null, mh)) {
            gmo.MsgHandle = BigInt(MQC.MQHM_NONE);
            const key = hcKey(hConn, hObj);
            const opts = objectOptionsMap.get(key);
            if (opts) {
                gmo.Options = opts.gmo;
            } else {
                gmo.Options &= ~MQC.MQGMO_PROPERTIES_IN_HANDLE;
            }
            log.debug("Removing our handle: hObj %o\n  opts %o", hObj, opts);
        }

        // Should we also remove the properties?
        // Probably not worth it, as any app dealing with
        // properties ought to be able to handle unexpected props.

    } else if (md.Format == MQC.MQFMT_RF_HEADER_2) {
        log.debug("Extracting properties from RFH2");
        const hdr = mqstruc.MQRFH2.getHeader(msg);
        const props = mqstruc.MQRFH2.getAllProperties(hdr, msg);
        log.debug("Got properties: %s", props);
        traceparentVal = extractRFH2PropVal(props, traceparent);
        tracestateVal = extractRFH2PropVal(props, tracestate);

        if (otelOpts && otelOpts.RemoveRFH2) {
            md.Format = hdr.Format;
            md.CodedCharSetId = hdr.CodedCharSetId;
            md.Encoding = hdr.Encoding;
            removed = hdr.StrucLength;
        }
    }

    const currentSpan = otelApi.trace.getSpan(otelApi.context.active());
    const context = {};
    let haveNewContext = false;
    let elem;
    if (traceparentVal) {
        // Split the inbound traceparent value into its components to allow
        // construction of a new context
        elem = traceparentVal.split("-");
        if (elem.length == 4) {
            // elem[0] = 0 (always, for now)
            context.traceId = elem[1];
            context.spanId = elem[2];
            context.traceFlags = elem[3] == "01" ? 1 : 0;
            haveNewContext = true;
        }
    }

    if (tracestateVal) {
        // The constructor deserialises the string value into a map so
        // we don't need to do it ourselves.
        context.traceState = otelApi.createTraceState(tracestateVal);
        haveNewContext = true;
    }

    // If there is a current span, then create a link to these values,
    if (haveNewContext) {
        if (currentSpan) {
            const msgContext = { context: context };
            log.debug("Created new context: %o", msgContext);
            currentSpan.addLink(msgContext);
            log.debug("Added link to current span");
        } else {
            // If there is no current active span, then we are not going to
            // try to create a new one, as we would have no way of knowing when it
            // ends. The properties are (probably) still available to the application if
            // it wants to work with them itself.
            log.debug("No current span to update");
        }
    } else {
        log.debug("No context properties found");
    }

    log.traceExit("getTraceAfter");

    return removed;
}

/* We don't need a full XML parse of the RFH2 properties
 * as we know the property has a limited range of characters.
 * In particular, the "<",">" are not used in the values, even
 * in some escaped format. So we can just search for them as strings directly.
 * You might be able to subvert this by having another property whose value is the key including the brackets,
 * but that would be foolish.
 */
function extractRFH2PropVal(props, prop) {
    const propXml = "<" + prop + ">";
    let val;

    for (let i = 0; i < props.length; i++) {
        const propEntry = props[i];
        const idx = propEntry.indexOf(propXml);
        if (idx != -1) {
            const start = propEntry.substr(idx + propXml.length);
            // Where does the next tag begin
            const end = start.indexOf("<");
            if (end != -1) {
                val = start.substr(0, end);
                break;
            }
        }
    }

    log.debug("Searching for %s in RFH2 msg: %s", prop, val ? val : "not found");
    return val;
}


// This object lets mqi.js set function pointers back into itself so we don't need to explicitly require() it
exports.mq = mq;

// These are the external functions that the MQPUT/PUT1/GET/CB operations will use
exports.openOtel = openAfter;
exports.closeOtel = closeAfter;

exports.putOtelTraceBefore = putTraceBefore;
exports.putOtelTraceAfter = putTraceAfter;

exports.getOtelSyncTraceBefore = getSyncTraceBefore;
exports.getOtelAsyncTraceBefore = getAsyncTraceBefore;
exports.getOtelTraceAfter = getTraceAfter;

exports.dltOtelHandles = dltHandles;


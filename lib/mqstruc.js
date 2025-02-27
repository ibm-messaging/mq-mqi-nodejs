"use strict";
/*
  Copyright (c) IBM Corporation 2017,2024

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
     Mark Taylor - Initial Contribution
*/

/*
 * mqdlh is a JavaScript object containing the fields we need for the MQDLH
 * in a more idiomatic style than the C definition - in particular for
 * fixed length character buffers.
 */
const MQC = require("./mqidefs.js");

// Import any other packages needed
const StringDecoder = require("string_decoder").StringDecoder;
const decoder = new StringDecoder("utf8");

/**
 * This constructor sets default values for the object.
 * @class
 * @classdesc
 * This is a class containing the fields needed for the
 * MQ RFH2 Header structure. See the
 * {@link https://www.ibm.com/docs/en/ibm-mq/latest?topic=mqi-mqrfh2-rules-formatting-header-2|MQ Documentation}
 * for more details on the usage of each field.
 * Not all of the underlying fields may be exposed in this object.
 */
exports.MQRFH2 = function (mqmd) {
    /** @member {number} */
    this.StrucLength = MQC.MQRFH_STRUC_LENGTH_FIXED_2;
    /** @member {number} */
    this.Encoding = MQC.MQENC_NATIVE;
    /** @member {number} */
    this.CodedCharSetId = MQC.MQCCSI_INHERIT;
    /** @member {Buffer} */
    this.Format = Buffer.alloc(MQC.MQ_FORMAT_LENGTH, " ");
    /** @member {number} */
    this.Flags = MQC.MQRFH_NONE;
    /** @member {number} */
    this.NameValueCCSID = 1208;


    // If a message descriptor has been supplied then we can
    // copy some fields from it and set its own fields. This does
    // the header chaining we need to describe the real data.
    if (mqmd) {
        this.Encoding = mqmd.Encoding;
        if (mqmd.CodedCharSetId == MQC.MQCCSI_DEFAULT)
            this.CodedCharSetId = MQC.MQCCSI_INHERIT;
        else
            this.CodedCharSetId = mqmd.CodedCharSetId;
        this.Format = mqmd.Format;

        mqmd.Format = "MQHRF2";
        mqmd.CodedCharSetId = MQC.MQCCSI_Q_MGR;
    }

    Object.seal(this);
};

/**
 * This constructor sets default values for the object.
 * @class
 * @classdesc
 * This is a class containing the fields needed for the mqdlh
 * (MQ Dead Letter Header) structure. See the
 * {@link https://www.ibm.com/docs/en/ibm-mq/latest?topic=mqi-mqdlh-dead-letter-header|MQ Documentation}
 * for more details on the usage of each field.
 * Not all of the underlying fields may be exposed in this object.
 */
exports.MQDLH = function (mqmd) {
    /** @member {number} */
    this.Reason = MQC.MQRC_NONE;
    /** @member {String} */
    this.DestQName = null;
    /** @member {String} */
    this.DestQMgrName = null;
    /** @member {number} */
    this.Encoding = 0;
    /** @member {number} */
    this.CodedCharSetId = MQC.MQCCSI_UNDEFINED;
    /** @member {Buffer} */
    this.Format = Buffer.alloc(MQC.MQ_FORMAT_LENGTH, " ");
    /** @member {number} */
    this.PutApplType = 0;
    /** @member {String} */
    this.PutApplName = null;
    /** @member {String} */
    this.PutDate = null;
    /** @member {String} */
    this.PutTime = null;
    /** @member {number} */
    this.StrucLength = MQC.MQDLH_CURRENT_LENGTH; /* Not a field in C structure */

    // If a message descriptor has been supplied then we can
    // copy some fields from it and set its own fields. This does
    // the header chaining we need to describe the real data.
    if (mqmd) {
        this.Encoding = mqmd.Encoding;
        if (mqmd.CodedCharSetId == MQC.MQCCSI_DEFAULT)
            this.CodedCharSetId = MQC.MQCCSI_INHERIT;
        else
            this.CodedCharSetId = mqmd.CodedCharSetId;
        this.Format = mqmd.Format;

        this.PutDate = mqmd.PutDate;
        this.PutTime = mqmd.PutTime;

        mqmd.Format = MQC.MQFMT_DEAD_LETTER_HEADER;
        mqmd.MsgType = MQC.MQMT_REPORT;
        mqmd.CodedCharSetId = MQC.MQCCSI_Q_MGR;
    }

    Object.seal(this);
};


const le = ((MQC.MQENC_NATIVE & MQC.MQENC_INTEGER_MASK) == MQC.MQENC_INTEGER_REVERSED);
function writeString(buf, offset, value, len) {
    buf.fill(" ", offset.o, offset.o + len);
    if (value) {
        buf.write(value, offset.o, len, "utf8");
    }
    offset.o += len;
    return;
}

function writeMQLONG(buf, offset, value) {
    if (le) {
        buf.writeInt32LE(value, offset.o);
    } else {
        buf.writeInt32BE(value, offset.o);
    }
    offset.o += 4;
    return;
}

function readMQLONG(buf, offset) {
    let rc;
    if (le) {
        rc = buf.readInt32LE(offset.o);
    } else {
        rc = buf.readInt32BE(offset.o);
    }
    offset.o += 4;
    return rc;
}

function readString(buf, offset, len) {
    const s = buf.toString("utf8", offset.o, offset.o + len);
    offset.o += len;
    return s.trim();
}


/**
 * The getBuffer function returns a version of the structure that can
 * be part of the message data when it is put to a queue. Use in conjunction
 * with Buffer.concat() to combine the buffers into a single buffer.
 */
exports.MQDLH.prototype.getBuffer = function () {
    const dlh = Buffer.alloc(MQC.MQDLH_CURRENT_LENGTH);
    const offset = { o: 0 };

    writeString(dlh, offset, "DLH ", 4);
    writeMQLONG(dlh, offset, MQC.MQDLH_CURRENT_VERSION);
    writeMQLONG(dlh, offset, this.Reason);

    writeString(dlh, offset, this.DestQName, MQC.MQ_Q_NAME_LENGTH);
    writeString(dlh, offset, this.DestQMgrName, MQC.MQ_Q_MGR_NAME_LENGTH);

    writeMQLONG(dlh, offset, this.Encoding);
    writeMQLONG(dlh, offset, this.CodedCharSetId);

    writeString(dlh, offset, this.Format, MQC.MQ_FORMAT_LENGTH);

    writeMQLONG(dlh, offset, this.PutApplType);
    writeString(dlh, offset, this.PutApplName, MQC.MQ_APPL_NAME_LENGTH);
    writeString(dlh, offset, this.PutDate, MQC.MQ_PUT_DATE_LENGTH);
    writeString(dlh, offset, this.PutTime, MQC.MQ_PUT_TIME_LENGTH);

    return dlh;
};

exports.MQRFH2.prototype.getBuffer = function () {
    const rfh2 = Buffer.alloc(MQC.MQRFH_STRUC_LENGTH_FIXED_2);
    const offset = { o: 0 };

    writeString(rfh2, offset, "RFH ", 4);
    writeMQLONG(rfh2, offset, MQC.MQRFH_VERSION_2);
    writeMQLONG(rfh2, offset, this.StrucLength);
    writeMQLONG(rfh2, offset, this.Encoding);
    writeMQLONG(rfh2, offset, this.CodedCharSetId);
    writeString(rfh2, offset, this.Format, MQC.MQ_FORMAT_LENGTH);
    writeMQLONG(rfh2, offset, this.Flags);
    writeMQLONG(rfh2, offset, this.NameValueCCSID);

    return rfh2;
};

/**
 * The getHeader function returns a JS structure. The StrucLength member
 * can be used to show how far to step through the message buffer for the
 * next element.
 */
exports.MQDLH.getHeader = function (buf) {
    const jsdlh = new exports.MQDLH();
    const offset = { o: 8 }; /* Skip past the StrucID and Version */

    jsdlh.Reason = readMQLONG(buf, offset);
    jsdlh.DestQName = readString(buf, offset, MQC.MQ_Q_NAME_LENGTH);
    jsdlh.DestQMgrName = readString(buf, offset, MQC.MQ_Q_MGR_NAME_LENGTH);

    jsdlh.Encoding = readMQLONG(buf, offset);
    jsdlh.CodedCharSetId = readMQLONG(buf, offset);

    jsdlh.Format = readString(buf, offset, MQC.MQ_FORMAT_LENGTH);

    jsdlh.PutApplType = readMQLONG(buf, offset);
    jsdlh.PutApplName = readString(buf, offset, MQC.MQ_APPL_NAME_LENGTH);
    jsdlh.PutDate = readString(buf, offset, MQC.MQ_PUT_DATE_LENGTH);
    jsdlh.PutTime = readString(buf, offset, MQC.MQ_PUT_TIME_LENGTH);

    return jsdlh;
};


exports.MQRFH2.getHeader = function (buf) {
    const jsrfh2 = new exports.MQRFH2();
    const offset = { o: 8 }; // Skip version and strucid

    jsrfh2.StrucLength = readMQLONG(buf, offset);
    jsrfh2.Encoding = readMQLONG(buf, offset);
    jsrfh2.CodedCharSetId = readMQLONG(buf, offset);
    jsrfh2.Format = readString(buf, offset, MQC.MQ_FORMAT_LENGTH);
    jsrfh2.Flags = readMQLONG(buf, offset);
    jsrfh2.NameValueCCSID = readMQLONG(buf, offset);

    return jsrfh2;
};


/**
 * getAllProperties returns the XML-like strings as an array.
 * Input is the already-parsed header structure and the entire message
 * body (including the unparsed header). Most likely, only propsArray[0]
 * is ever populated.
 */
function getAllProperties(hdr, buf) {
    const propsArray = [];
    const offset = { o: MQC.MQRFH_STRUC_LENGTH_FIXED_2 };

    while (offset.o < hdr.StrucLength) {
        const propLen = readMQLONG(buf, offset);
        const s = decoder.write(buf.subarray(offset.o, offset.o + propLen)).trim();
        offset.o += propLen;
        propsArray.push(s);
    }

    return propsArray;
}
exports.MQRFH2.getAllProperties = getAllProperties;

/**
 * @deprecated since version 2.1.0. Use of {@link getAllProperties} is preferred.
 *
 * getProperties returns all of the namevalue data elements in the RFH2 as a single string.
 * This was the original behaviour provided, and is fine if there is only a single element in the RFH2
 * structure. Preferred, however, is the newer and more general getAllProperties which returns
 * the elements as separate array entries.
 */
exports.MQRFH2.getProperties = function (hdr, buf) {
    let s = "";
    const props = getAllProperties(hdr, buf);

    for (let i = 0; i < props.length; i++) {
        s += props[i];
    }
    return s;
};

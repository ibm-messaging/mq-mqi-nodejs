declare module "ibmmq" {
  /*
   * mqrfh2 is a JavaScript object containing the fields we need for the MQRFH2
   * in a more idiomatic style than the C definition - in particular for
   * fixed length character buffers.
   */

  /**
   * This constructor sets default values for the object.
   * @class
   * @classdesc
   * This is a class containing the fields needed for the
   * MQ RFH2 Header structure. See the
   * {@link https://www.ibm.com/support/knowledgecenter/en/SSFKSJ_latest/com.ibm.mq.ref.dev.doc/q096110_.htm|MQ Knowledge Center}
   * for more details on the usage of each field.
   * Not all of the underlying fields may be exposed in this object.
   */
  class MQRFH2 {
    constructor(mqmd?: MQMD);

    StrucLength: number;
    Encoding: MQC_MQENC;
    CodedCharSetId: MQC_MQCCSI;
    Format: MQFMT;
    Flags: MQC_MQRFH;
    NameValueCCSID: number;

    /**
     * The getBuffer function returns a version of the structure that can
     * be part of the message data when it is put to a queue. Use in conjunction
     * with Buffer.concat() to combine the buffers into a single buffer.
     */
    getBuffer: () => Buffer;

    /**
     * The getHeader function returns a JS structure. The StrucLength member
     * can be used to show how far to step through the message buffer for the
     * next element.
     */
    static getHeader: (buf: Buffer) => MQRFH2;

    /**
     * getProperties returns the XML-like string. Input is the already-parsed
     * header structure and the entire message body (including the unparsed header)
     */
    static getProperties: (hdr: MQRFH2, buf: Buffer) => string;
  }
}

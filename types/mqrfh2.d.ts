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
   * MQ RFH2 Header structure. 
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
     * getAllProperties returns the XML-like strings as an array.
     * Input is the already-parsed header structure and the entire message
     * body (including the unparsed header). Most likely, only propsArray[0]
     * is ever populated.
     */
    static getAllProperties(hdr: MQRFH2, buf: Buffer): string[];

    /**
     * @deprecated since version 2.1.0. Use of {@link getAllProperties} is preferred.
     *
     * getProperties returns all of the namevalue data elements in the RFH2 as a single string.
     * This was the original behaviour provided, and is fine if there is only a single element in the RFH2
     * structure. Preferred, however, is the newer and more general getAllProperties which returns
     * the elements as separate array entries.
     */
    static getProperties: (hdr: MQRFH2, buf: Buffer) => string;
  }
}

declare module "ibmmq" {
  /**
   * This is a class containing the fields needed for the mqdlh
   * (MQ Dead Letter Header) structure. See the
   * {@link https://www.ibm.com/support/knowledgecenter/en/SSFKSJ_latest/com.ibm.mq.ref.dev.doc/q096110_.htm |MQ Knowledge Center}
   * for more details on the usage of each field.
   * Not all of the underlying fields may be exposed in this object.
   */
  class MQDLH {
    constructor(mqmd?: MQMD);

    Reason: MQC_MQRC;
    DestQName: string;
    DestQMgrName: string;
    Encoding: MQC_MQENC;
    CodedCharSetId: MQC_MQCCSI;
    Format: MQFMT;
    PutApplType: number;
    PutApplName: string;
    PutDate: string;
    PutTime: string;
    StrucLength: number;

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
    static getHeader: (buf: Buffer) => MQDLH;
  }
}

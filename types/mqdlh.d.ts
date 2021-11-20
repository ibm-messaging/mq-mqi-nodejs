declare module 'ibmmq' {
  /**
   * This is a class containing the fields needed for the mqdlh
   * (MQ Dead Letter Header) structure. See the
   * {@link https://www.ibm.com/support/knowledgecenter/en/SSFKSJ_latest/com.ibm.mq.ref.dev.doc/q096110_.htm|MQ Knowledge Center}
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
    Format: MQC_MQFMT;
    PutApplType: number;
    PutApplName: string;
    PutDate: string;
    PutTime: string;
    StrucLength: MQC_MQDLH;
  }
}

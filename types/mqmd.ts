declare module 'ibmmq' {
  /**
   * This is a class containing the fields needed for the MQMD
   * (MQ Message Descriptor) structure. See the
   * {@link https://www.ibm.com/support/knowledgecenter/en/SSFKSJ_latest/com.ibm.mq.ref.dev.doc/q097390_.htm |MQ Knowledge Center}
   * for more details on the usage of each field.
   * Not all of the underlying fields may be exposed in this object.
   */
  class MQMD {
    Report: MQC_MQRO;
    MsgType: MQC_MQMT;
    Expiry: MQC_MQEI;
    Feedback: MQC_MQFB;
    Encoding: MQC_MQENC;
    CodedCharSetId: MQC_MQCCSI;
    Format: Buffer | Uint8Array | object | string;
    Priority: MQC_MQPRI;
    Persistence: MQC_MQPER;
    MsgId: Buffer | Uint8Array | object | string;
    CorrelId: Buffer | Uint8Array | object | string;
    BackoutCount: number;
    ReplyToQ: string;
    ReplyToQMgr: string;
    UserIdentifier: string;
    AccountingToken: Buffer | Uint8Array | object | string;
    ApplIdentityData: string;
    PutApplType: MQC_MQAT;
    PutApplName: string;
    PutDate: string;
    PutTime: string;
    ApplOriginData: string;
    GroupId: Buffer | Uint8Array | object | string;
    MsgSeqNumber: number;
    Offset: number;
    MsgFlags: MQC_MQMF;
    OriginalLength: MQC_MQOL;
  }
}

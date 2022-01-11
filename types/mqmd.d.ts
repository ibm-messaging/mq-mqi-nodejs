declare module "ibmmq" {
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
    Format: MQFMT;
    Priority: MQC_MQPRI;
    Persistence: MQC_MQPER;
    MsgId: Buffer;
    CorrelId: Buffer;
    BackoutCount: number;
    ReplyToQ: string;
    ReplyToQMgr: string;
    UserIdentifier: string;
    AccountingToken: Buffer;
    ApplIdentityData: string;
    PutApplType: MQC_MQAT;
    PutApplName: string;
    PutDate: string;
    PutTime: string;
    ApplOriginData: string;
    GroupId: Buffer;
    MsgSeqNumber: number;
    Offset: number;
    MsgFlags: MQC_MQMF;
    OriginalLength: MQC_MQOL;
  }
}

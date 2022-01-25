declare module "ibmmq" {
  /**
   * This is a class containing the fields needed for the MQSD
   * (MQ Subscription Descriptor) structure. See the
   * {@link https://www.ibm.com/support/knowledgecenter/en/SSFKSJ_latest/com.ibm.mq.ref.dev.doc/q100010_.htm |MQ Knowledge Center}
   * for more details on the usage of each field.
   * Not all of the underlying fields may be exposed in this object.
   */
  class MQSD {
    Options: number | MQC_MQSO[];  
    ObjectName: string;
    AlternateUserId: string;
    AlternateSecurityId: Buffer;
    SubExpiry: MQC_MQEI;
    ObjectString: string;
    SubName: string;
    SubUserData: string;
    SubCorrelId: Buffer;
    PubPriority: MQC_MQPRI;
    PubAccountingToken: Buffer;
    PubApplIdentityData: string;
    SelectionString: string;
    SubLevel: number;
    ResObjectString: string;
  }
}

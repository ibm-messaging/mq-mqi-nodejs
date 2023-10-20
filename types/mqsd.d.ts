declare module "ibmmq" {
  /**
   * This is a class containing the fields needed for the MQSD
   * (MQ Subscription Descriptor) structure. 
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

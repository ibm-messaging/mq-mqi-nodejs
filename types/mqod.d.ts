declare module "ibmmq" {
  /**
   * This is a class containing the fields needed for the MQOD
   * (MQ Object Descriptor) structure. See the
   * {@link https://www.ibm.com/support/knowledgecenter/en/SSFKSJ_latest/com.ibm.mq.ref.dev.doc/q098100_.htm |MQ Knowledge Center}
   * for more details on the usage of each field.
   * Not all of the underlying fields may be exposed in this object.
   */
  class MQOD {
    ObjectType: MQC_MQOT;
    ObjectName: string | null;
    ObjectQMgrName: string | null;
    DynamicQName: string | null;
    AlternateUserId: string | null;
    AlternateSecurityId: Buffer;
    ResolvedQName: string;
    ResolvedQMgrName: string;
    ObjectString: string;
    SelectionString: string;
    ResObjectString: string;
    ResolvedType: MQC_MQOT;
  }
}

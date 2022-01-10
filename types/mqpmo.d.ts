declare module "ibmmq" {
  /**
   * This is a class containing the fields needed for the MQPMO
   * (MQ Put Message Options) structure. See the
   * {@link https://www.ibm.com/support/knowledgecenter/en/SSFKSJ_latest/com.ibm.mq.ref.dev.doc/q098650_.htm|MQ Knowledge Center}
   * for more details on the usage of each field.
   * Not all of the underlying fields may be exposed in this object.
   * <p>Note: This sets the FIQ flag by default, which is not standard in the MQI
   * but probably should have been. It's also forced to be set elsewhere.
   */
  class MQPMO {
    Options: number;
    Context: string;
    ResolvedQName: string;
    ResolvedQMgrName: string;
    OriginalMsgHandle: HMSG;
    NewMsgHandle: number;
    Action: number;
    PubLevel: number;
  }
}

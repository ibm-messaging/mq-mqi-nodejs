declare module "ibmmq" {
  /**
   * This is a class containing the fields needed for the MQPMO
   * (MQ Put Message Options) structure. 
   * Not all of the underlying fields may be exposed in this object.
   * <p>Note: This sets the FIQ flag by default, which is not standard in the MQI
   * but probably should have been. It's also forced to be set elsewhere.
   */
  class MQPMO {
    Options:number | MQC_MQPMO[]; 
    Context: string;
    ResolvedQName: string;
    ResolvedQMgrName: string;
    OriginalMsgHandle: HMSG;
    NewMsgHandle: HMSG;
    Action: number;
    PubLevel: number;
    OtelOpts: OtelOpts;
  }
}

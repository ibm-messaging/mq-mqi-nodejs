declare module "ibmmq" {
  
  /**
   * This is a class containing the fields needed for the MQGMO
   * (MQ Get Message Options) structure.
   * Not all of the underlying fields may be exposed in this object.
   * <p>Note: This sets the FIQ flag by default, which is not standard in the MQI
   * but probably should have been. It's also forced to be set elsewhere.
   */
  class MQGMO {
    Options: number | MQC_MQGMO[];   
    WaitInterval: number;
    ResolvedQName: string | null;
    MatchOptions: number | MQC_MQMO[];  
    GroupStatus: string;
    SegmentStatus: string;
    Segmentation: string;
    MsgToken: Buffer;
    ReturnedLength: number;
    MsgHandle: HMSG;
    OtelOpts: OtelOpts;
  }
}

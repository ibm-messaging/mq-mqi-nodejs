declare module "ibmmq" {
  /*
   * MQGMO is a JavaScript object containing the fields we need for the MQGMO
   * in a more idiomatic style than the C definition - in particular for
   * fixed length character buffers.
   */

  /**
   * This is a class containing the fields needed for the MQGMO
   * (MQ Get Message Options) structure. See the
   * {@link https://www.ibm.com/support/knowledgecenter/en/SSFKSJ_latest/com.ibm.mq.ref.dev.doc/q096710_.htm|MQ Knowledge Center}
   * for more details on the usage of each field.
   * Not all of the underlying fields may be exposed in this object.
   * <p>Note: This sets the FIQ flag by default, which is not standard in the MQI
   * but probably should have been. It's also forced to be set elsewhere.
   */
  class MQGMO {
    Options: number;   
    WaitInterval: number;
    ResolvedQName: string | null;
    MatchOptions: number;  
    GroupStatus: string;
    SegmentStatus: string;
    Segmentation: string;
    MsgToken: Buffer;
    ReturnedLength: number;
    MsgHandle: HMSG;
  }
}

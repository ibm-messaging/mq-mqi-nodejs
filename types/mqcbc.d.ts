declare module "ibmmq" {
  /**
   * This is a class containing the fields needed for the MQCBC
   * (MQ CallBack Context) structure. See the
   * {@link https://www.ibm.com/support/knowledgecenter/en/SSFKSJ_latest/com.ibm.mq.ref.dev.doc/q094330_.htm |MQ Knowledge Center}
   * for more details on the usage of each field.
   * Not all of the underlying fields may be exposed in this object.
   */
  class MQCBC {
    CallType: MQC_MQCBCT;
    State: MQC_MQCS;
    DataLength: number;
    BufferLength: number;
    Flags: MQC_MQCBCF;
    ReconnectDelay: number;
  }
}

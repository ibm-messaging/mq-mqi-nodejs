declare module "ibmmq" {
  /**
   * This is a class containing the fields needed for the MQCBC
   * (MQ CallBack Context) structure. .
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

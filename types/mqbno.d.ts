declare module "ibmmq" {
  /**
   * This is a class containing the fields needed for the MQBNO
   * (MQ Balance Options Parameters) structure.
   */
  class MQBNO {
    ApplType: MQC_MQBNO_BALTYPE;
    Timeout: MQC_MQBNO_TIMEOUT;
    Options: number;
  }
}

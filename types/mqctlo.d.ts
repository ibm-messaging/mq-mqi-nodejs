declare module "ibmmq" {
  /**
   * This is a class containing the fields needed for the MQCTLO
   * (MQ Control Callback Options) structure. 
   * Not all of the underlying fields may be exposed in this object.
   */
  class MQCTLO {
    Options: number |MQC_MQCTLO[];     
  }
}

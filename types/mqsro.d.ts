declare module "ibmmq" {
  /**
   * This is a class containing the fields needed for the MQSRO
   * (MQ Subscription Request Options) structure. 
   */
  class MQSRO {
    Options: number | MQC_MQSRO[];   
    NumPubs: number;
  }
}

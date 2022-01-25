declare module "ibmmq" {
  /**
   * This is a class containing the fields needed for the MQSRO
   * (MQ Subscription Request Options) structure. See the
   * {@link https://www.ibm.com/docs/en/ibm-mq/9.2?topic=mqi-mqsro-subscription-request-options |MQ Knowledge Center}
   * for more details on the usage of each field.
   */
  class MQSRO {
    Options: number | MQC_MQSRO[];   
    NumPubs: number;
  }
}

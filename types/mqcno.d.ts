declare module "ibmmq" {
  /**
   * This is a class containing the fields needed for the MQCNO
   * (MQ Connection Options) structure. 
   * Not all of the underlying fields may be exposed in this object.
   */
  class MQCNO {
    Options: number | MQC_MQCNO[];   
    SecurityParms: MQCSP;
    CCDTUrl: string;
    ClientConn: MQCD;
    SSLConfig: MQSCO;
    ApplName: string;
    BalanceParms: MQBNO;
  }
}

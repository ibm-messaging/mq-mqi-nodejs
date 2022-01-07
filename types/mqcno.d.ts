declare module "ibmmq" {
  /**
   * This is a class containing the fields needed for the MQCNO
   * (MQ Connection Options) structure. See the
   * {@link https://www.ibm.com/support/knowledgecenter/en/SSFKSJ_latest/com.ibm.mq.ref.dev.doc/q095410_.htm|MQ Knowledge Center}
   * for more details on the usage of each field.
   * Not all of the underlying fields may be exposed in this object.
   */
  class MQCNO {
    Options: number;   
    SecurityParms: MQCSP;
    CCDTUrl: string;
    ClientConn: MQCD;
    SSLConfig: MQSCO;
    ApplName: string;
    BalanceParms: MQBNO;
  }
}

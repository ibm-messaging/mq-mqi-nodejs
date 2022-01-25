declare module "ibmmq" {
  /**
   * This is a class containing the fields needed for the MQSTS
   * (MQ Status reporting) structure. See the
   * {@link https://www.ibm.com/docs/en/ibm-mq/9.2?topic=mqi-mqsts-status-reporting-structure |MQ Knowledge Center}
   * for more details on the usage of each field.
   */
  class MQSTS {
    CompCode: MQC_MQCC;
    Reason: MQC_MQRC;
    PutSuccessCount: number;
    PutWarningCount: number;
    PutFailureCount: number;

    ObjectType: MQC_MQOT;
    ObjectName: string;
    ObjectQMgrName: string;
    ResolvedObjectName: string;
    ResolvedQMgrName: string;

    ObjectString: string;
    SubName: string;
    OpenOptions: number | MQC_MQOO[];    
    SubOptions: number | MQC_MQSO[];    
  }
}

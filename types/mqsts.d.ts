declare module "ibmmq" {
  /**
   * This is a class containing the fields needed for the MQSTS
   * (MQ Status reporting) structure. 
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

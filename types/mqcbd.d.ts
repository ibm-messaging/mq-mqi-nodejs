declare module "ibmmq" {
  /**
   * This is a class containing the fields needed for the MQCBD
   * (MQ CallBack Descriptor) structure. 
   * Not all of the underlying fields may be exposed in this object.
   */
  class MQCBD {
    CallbackType: MQC_MQCBT;
    Options: number | MQC_MQCBD[];    
    CallbackArea: string;
    CallbackFunction: string;
    CallbackName: string;
    MaxMsgLength: number;
  }
}

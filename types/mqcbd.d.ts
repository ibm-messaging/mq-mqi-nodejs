declare module "ibmmq" {
  /**
   * This is a class containing the fields needed for the MQCBD
   * (MQ CallBack Descriptor) structure. See the
   * {@link https://www.ibm.com/support/knowledgecenter/en/SSFKSJ_latest/com.ibm.mq.ref.dev.doc/q094540_.htm |MQ Knowledge Center}
   * for more details on the usage of each field.
   * Not all of the underlying fields may be exposed in this object.
   */
  class MQCBD {
    CallbackType: MQC_MQCBT;
    Options: number;    
    CallbackArea: string;
    CallbackFunction: string;
    CallbackName: string;
    MaxMsgLength: MQC_MQCBD;
  }
}

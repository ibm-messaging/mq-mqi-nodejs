declare module "ibmmq" {
  /**
   * This is a class containing the fields needed for the MQIMPO
   * (MQ Inquire Message Property Options) structure. See the
   * {@link https://www.ibm.com/support/knowledgecenter/en/SSFKSJ_latest/com.ibm.mq.ref.dev.doc/q097210_.htm |MQ Knowledge Center}
   * for more details on the usage of each field.
   */
  class MQIMPO {
    Options: number | MQC_MQIMPO[];    
    ReturnedName: string;
    TypeString: string;
    ReturnedEncoding: MQC_MQENC;
    ReturnedCCSID: MQC_MQCCSI;
  }

  /**
   * This is a class containing the fields needed for the MQSMPO
   * (MQ Set Message Property Options) structure. See the
   * {@link https://www.ibm.com/support/knowledgecenter/en/SSFKSJ_latest/com.ibm.mq.ref.dev.doc/q100270_.htm |MQ Knowledge Center}
   * for more details on the usage of each field.
   */
  class MQSMPO {
    Options: number | MQC_MQSMPO[];    
  }

  /**
   * This is a class containing the fields needed for the MQDMPO
   * (MQ Delete Message Property Options) structure. See the
   * {@link https://www.ibm.com/support/knowledgecenter/en/SSFKSJ_latest/com.ibm.mq.ref.dev.doc/q096430_.htm |MQ Knowledge Center}
   * for more details on the usage of each field.
   */
  class MQDMPO {
    Options: number | MQC_MQDMPO[];    
  }

  /**
   * This is a class containing the fields needed for the MQPD
   * (MQ Property Descriptor) structure. See the
   * {@link https://www.ibm.com/support/knowledgecenter/en/SSFKSJ_latest/com.ibm.mq.ref.dev.doc/q098510_.htm |MQ Knowledge Center}
   * for more details on the usage of each field.
   */
  class MQPD {
    Options: number | MQC_MQPD_OPTIONS[];          
    Support: MQC_MQPD_SUPPORT;
    Context: MQC_MQPD_CONTEXT;
    CopyOptions: number | MQC_MQCOPY[];    
  }
}

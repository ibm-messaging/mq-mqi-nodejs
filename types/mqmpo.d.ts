declare module "ibmmq" {
  /**
   * This is a class containing the fields needed for the MQIMPO
   * (MQ Inquire Message Property Options) structure. 
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
   * (MQ Set Message Property Options) structure. 
   */
  class MQSMPO {
    Options: number | MQC_MQSMPO[];    
  }

  /**
   * This is a class containing the fields needed for the MQDMPO
   * (MQ Delete Message Property Options) structure. 
   */
  class MQDMPO {
    Options: number | MQC_MQDMPO[];    
  }

  /**
   * This is a class containing the fields needed for the MQPD
   * (MQ Property Descriptor) structure. 
   */
  class MQPD {
    Options: number | MQC_MQPD_OPTIONS[];          
    Support: MQC_MQPD_SUPPORT;
    Context: MQC_MQPD_CONTEXT;
    CopyOptions: number | MQC_MQCOPY[];    
  }
}

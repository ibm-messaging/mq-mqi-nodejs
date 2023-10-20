declare module "ibmmq" {
  /**
   * This is a class containing the fields needed for the MQCMHO
   * (MQ Create Message Handle Options) structure. 
   */
  class MQCMHO {
    Options: number |MQC_MQCMHO[];    
  }

  /**
   * This is a class containing the fields needed for the MQDMHO
   * (MQ Delete Message Handle Options) structure. 
   */
  class MQDMHO {
    Options: number|MQC_MQDMHO[];    
  }
}

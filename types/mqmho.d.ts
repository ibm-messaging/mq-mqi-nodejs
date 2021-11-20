declare module 'ibmmq' {
  /**
   * This is a class containing the fields needed for the MQCMHO
   * (MQ Create Message Handle Options) structure. See the
   * {@link https://www.ibm.com/support/knowledgecenter/en/SSFKSJ_latest/com.ibm.mq.ref.dev.doc/q095320_.htm |MQ Knowledge Center}
   * for more details on the usage of each field.
   */
  class MQCMHO {
    Options: MQC_MQCMHO;
  }

  /**
   * This is a class containing the fields needed for the MQDMHO
   * (MQ Delete Message Handle Options) structure. See the
   * {@link https://www.ibm.com/support/knowledgecenter/en/SSFKSJ_latest/com.ibm.mq.ref.dev.doc/q096320_.htm |MQ Knowledge Center}
   * for more details on the usage of each field.
   */
  class MQDMHO {
    Options: MQC_MQDMHO;
  }
}

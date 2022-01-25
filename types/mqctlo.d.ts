declare module "ibmmq" {
  /**
   * This is a class containing the fields needed for the MQCTLO
   * (MQ Control Callback Options) structure. See the
   * {@link https://www.ibm.com/support/knowledgecenter/en/SSFKSJ_latest/com.ibm.mq.ref.dev.doc/q095800_.htm|MQ Knowledge Center}
   * for more details on the usage of each field.
   * Not all of the underlying fields may be exposed in this object.
   */
  class MQCTLO {
    Options: number |MQC_MQCTLO[];     
  }
}

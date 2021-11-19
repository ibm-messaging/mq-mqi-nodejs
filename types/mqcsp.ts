declare module 'ibmmq' {
  /**
   * This is a class containing the fields needed for the MQCSP
   * (MQ Connection Security Parameters) structure. See the
   * {@link https://www.ibm.com/support/knowledgecenter/en/SSFKSJ_latest/com.ibm.mq.ref.dev.doc/q095610_.htm |MQ Knowledge Center}
   * for more details on the usage of each field.
   * Not all of the underlying fields may be exposed in this object. For example,
   * unlike the regular MQI, we don't bother exposing the authenticationType
   * attribute, as there's currently only one value other than none - and setting
   * the userid and password implies you want to use it.
   */
  class MQCSP {
    UserId: string;
    Password: string;
  }
}

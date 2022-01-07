declare module "ibmmq" {
  /**
   * This is a class containing the fields needed for the MQCD
   * (MQ Channel Definition) structure. See the
   * {@link https://www.ibm.com/support/knowledgecenter/en/SSFKSJ_latest/com.ibm.mq.ref.dev.doc/q108220_.htm |MQ Knowledge Center}
   * for more details on the usage of each field.
   * Not all of the underlying fields may be exposed in this object.
   */
  class MQCD {
    ChannelName: string;
    ConnectionName: string;
    DiscInterval: number;
    SecurityExit: string;
    SecurityUserData: string;
    MaxMsgLength: number;
    HeartbeatInterval: number;
    SSLCipherSpec: string;
    SSLPeerName: string;
    SSLClientAuth: MQC_MQSCA;
    KeepAliveInterval: MQC_MQKAI;
    SharingConversations: number;
    PropertyControl: MQC_MQPROP;
    ClientChannelWeight: number;
    ConnectionAffinity: MQC_MQCAFTY;
    DefReconnect: MQC_MQRCN;
    CertificateLabel: string;
    HdrCompList: MQC_MQCOMPRESS[];
    MsgCompList: MQC_MQCOMPRESS[];
  }
}

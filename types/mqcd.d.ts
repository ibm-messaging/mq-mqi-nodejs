declare module "ibmmq" {
  /**
   * This is a class containing the fields needed for the MQCD
   * (MQ Channel Definition) structure.
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
    SSLClientAuth: MQC_MQSCA; /* Not used, but leave here for compatibility */
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

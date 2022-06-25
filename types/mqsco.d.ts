declare module "ibmmq" {
  /**
   * This is a class containing the fields needed for the MQSCO
   * (MQ SSL/TLS Configuration Options) structure. See the
   * {@link https://www.ibm.com/support/knowledgecenter/en/SSFKSJ_latest/com.ibm.mq.ref.dev.doc/q099820_.htm |MQ Knowledge Center}
   * for more details on the usage of each field.
   * Note the warnings in the
   * {@link https://www.ibm.com/support/knowledgecenter/en/SSFKSJ_latest/com.ibm.mq.ref.dev.doc/q095520_.htm |MQ Knowledge Center}
   * about the process-wide, once-only definition of this structure and
   * the MQRC_SSL_ALREADY_INITIALIZED warning reason code. From MQ 9.2.5 that can be avoided with the EnvironmentScope option
   */
  class MQSCO {
    KeyRepository: string;
    CryptoHardware: string;
    KeyResetCount: MQC_MQSCO;
    FipsRequired: boolean;
    EncryptionPolicySuiteB: MQC_MQ_SUITE_B[];
    CertificateValPolicy: MQC_MQ_CERT;
    CertificateLabel: string;
    KeyRepoPassword: string;
  }
}

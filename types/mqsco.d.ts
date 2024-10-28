declare module "ibmmq" {
  /**
   * This is a class containing the fields needed for the MQSCO
   * (MQ SSL/TLS Configuration Options) structure. 
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
    HTTPSKeyStore: string;
    HTTPSCertValidation:  MQC_MQ_HTTPSCERTVAL;
    HTTPSCertRevocation: MQC_MQ_HTTPSCERTREV;

  }
}

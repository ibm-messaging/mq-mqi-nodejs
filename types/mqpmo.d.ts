declare module "ibmmq" {
  /**
   * This is a class containing the fields needed for the MQPMO
   * (MQ Put Message Options) structure. See the
   * {@link https://www.ibm.com/support/knowledgecenter/en/SSFKSJ_latest/com.ibm.mq.ref.dev.doc/q098650_.htm|MQ Knowledge Center}
   * for more details on the usage of each field.
   * Not all of the underlying fields may be exposed in this object.
   * <p>Note: This sets the FIQ flag by default, which is not standard in the MQI
   * but probably should have been. It's also forced to be set elsewhere.
   */
  class MQPMO {
    Options: number;
    Context: string;
    ResolvedQName: string;
    ResolvedQMgrName: string;
    OriginalMsgHandle: number;
    NewMsgHandle: number;
    Action: number;
    PubLevel: number;
  }

  enum MQC_MQPMO {
    MQPMO_ALTERNATE_USER_AUTHORITY = 4096,
    MQPMO_ASYNC_RESPONSE = 65536,
    MQPMO_CURRENT_LENGTH = 184,
    MQPMO_CURRENT_VERSION = 3,
    MQPMO_DEFAULT_CONTEXT = 32,
    MQPMO_FAIL_IF_QUIESCING = 8192,
    MQPMO_LENGTH_1 = 128,
    MQPMO_LENGTH_2 = 160,
    MQPMO_LENGTH_3 = 184,
    MQPMO_LOGICAL_ORDER = 32768,
    MQPMO_MD_FOR_OUTPUT_ONLY = 8388608,
    MQPMO_NEW_CORREL_ID = 128,
    MQPMO_NEW_MSG_ID = 64,
    MQPMO_NONE = 0,
    MQPMO_NOT_OWN_SUBS = 268435456,
    MQPMO_NO_CONTEXT = 16384,
    MQPMO_NO_SYNCPOINT = 4,
    MQPMO_PASS_ALL_CONTEXT = 512,
    MQPMO_PASS_IDENTITY_CONTEXT = 256,
    MQPMO_PUB_OPTIONS_MASK = 2097152,
    MQPMO_RESOLVE_LOCAL_Q = 262144,
    MQPMO_RESPONSE_AS_Q_DEF = 0,
    MQPMO_RESPONSE_AS_TOPIC_DEF = 0,
    MQPMO_RETAIN = 2097152,
    MQPMO_SCOPE_QMGR = 67108864,
    MQPMO_SET_ALL_CONTEXT = 2048,
    MQPMO_SET_IDENTITY_CONTEXT = 1024,
    MQPMO_SUPPRESS_REPLYTO = 134217728,
    MQPMO_SYNCPOINT = 2,
    MQPMO_SYNC_RESPONSE = 131072,
    MQPMO_VERSION_1 = 1,
    MQPMO_VERSION_2 = 2,
    MQPMO_VERSION_3 = 3,
    MQPMO_WARN_IF_NO_SUBS_MATCHED = 524288,
  }
}

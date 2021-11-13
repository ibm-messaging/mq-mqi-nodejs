declare module "ibmmq" {
  /*
   * MQGMO is a JavaScript object containing the fields we need for the MQGMO
   * in a more idiomatic style than the C definition - in particular for
   * fixed length character buffers.
   */

  /**
   * This is a class containing the fields needed for the MQGMO
   * (MQ Get Message Options) structure. See the
   * {@link https://www.ibm.com/support/knowledgecenter/en/SSFKSJ_latest/com.ibm.mq.ref.dev.doc/q096710_.htm|MQ Knowledge Center}
   * for more details on the usage of each field.
   * Not all of the underlying fields may be exposed in this object.
   * <p>Note: This sets the FIQ flag by default, which is not standard in the MQI
   * but probably should have been. It's also forced to be set elsewhere.
   */
  class MQGMO {
    Options: MQC_MQGMO;
    WaitInterval: number;
    ResolvedQName: string | null;
    MatchOptions: MQC_MQMO;
    GroupStatus: string;
    SegmentStatus: string;
    Segmentation: string;
    MsgToken: Buffer;
    ReturnedLength: number;
    MsgHandle: number;
  }

  enum MQC_MQGMO {
    MQGMO_ACCEPT_TRUNCATED_MSG = 64,
    MQGMO_ALL_MSGS_AVAILABLE = 131072,
    MQGMO_ALL_SEGMENTS_AVAILABLE = 262144,
    MQGMO_BROWSE_CO_OP = 18874384,
    MQGMO_BROWSE_FIRST = 16,
    MQGMO_BROWSE_HANDLE = 17825808,
    MQGMO_BROWSE_MSG_UNDER_CURSOR = 2048,
    MQGMO_BROWSE_NEXT = 32,
    MQGMO_COMPLETE_MSG = 65536,
    MQGMO_CONVERT = 16384,
    MQGMO_CURRENT_LENGTH = 112,
    MQGMO_CURRENT_VERSION = 4,
    MQGMO_FAIL_IF_QUIESCING = 8192,
    MQGMO_LENGTH_1 = 72,
    MQGMO_LENGTH_2 = 80,
    MQGMO_LENGTH_3 = 100,
    MQGMO_LENGTH_4 = 112,
    MQGMO_LOCK = 512,
    MQGMO_LOGICAL_ORDER = 32768,
    MQGMO_MARK_BROWSE_CO_OP = 2097152,
    MQGMO_MARK_BROWSE_HANDLE = 1048576,
    MQGMO_MARK_SKIP_BACKOUT = 128,
    MQGMO_MSG_UNDER_CURSOR = 256,
    MQGMO_NONE = 0,
    MQGMO_NO_PROPERTIES = 67108864,
    MQGMO_NO_SYNCPOINT = 4,
    MQGMO_NO_WAIT = 0,
    MQGMO_PROPERTIES_AS_Q_DEF = 0,
    MQGMO_PROPERTIES_COMPATIBILITY = 268435456,
    MQGMO_PROPERTIES_FORCE_MQRFH2 = 33554432,
    MQGMO_PROPERTIES_IN_HANDLE = 134217728,
    MQGMO_SET_SIGNAL = 8,
    MQGMO_SYNCPOINT = 2,
    MQGMO_SYNCPOINT_IF_PERSISTENT = 4096,
    MQGMO_UNLOCK = 1024,
    MQGMO_UNMARKED_BROWSE_MSG = 16777216,
    MQGMO_UNMARK_BROWSE_CO_OP = 4194304,
    MQGMO_UNMARK_BROWSE_HANDLE = 8388608,
    MQGMO_VERSION_1 = 1,
    MQGMO_VERSION_2 = 2,
    MQGMO_VERSION_3 = 3,
    MQGMO_VERSION_4 = 4,
    MQGMO_WAIT = 1,
  }

  enum MQC_MQMO {
    MQMO_MATCH_CORREL_ID = 2,
    MQMO_MATCH_GROUP_ID = 4,
    MQMO_MATCH_MSG_ID = 1,
    MQMO_MATCH_MSG_SEQ_NUMBER = 8,
    MQMO_MATCH_MSG_TOKEN = 32,
    MQMO_MATCH_OFFSET = 16,
    MQMO_NONE = 0,
  }
}

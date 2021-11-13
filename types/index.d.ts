// import 'mqrc';

declare module "ibmmq" {
  enum MQCOMPRESS {
    MQCOMPRESS_NONE = 0,
    MQCOMPRESS_NOT_AVAILABLE = -1,
  }
  /**
   * This is a class containing the fields needed for the MQCD
   * (MQ Channel Definition) structure. See the
   * {@link https://www.ibm.com/support/knowledgecenter/en/SSFKSJ_latest/com.ibm.mq.ref.dev.doc/q108220_.htm|MQ Knowledge Center}
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
    SSLClientAuth: number;
    KeepAliveInterval: number;
    SharingConversations: number;
    PropertyControl: number;
    ClientChannelWeight: number;
    ConnectionAffinity: number;
    DefReconnect: number;
    CertificateLabel: string;
    HdrCompList: MQCOMPRESS[];
    MsgCompList: MQCOMPRESS[];
  }

  /**
   * This is a class containing the fields needed for the MQCSP
   * (MQ Connection Security Parameters) structure. See the
   * {@link https://www.ibm.com/support/knowledgecenter/en/SSFKSJ_latest/com.ibm.mq.ref.dev.doc/q095610_.htm|MQ Knowledge Center}
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

  /**
   * This is a class containing the fields needed for the MQMD
   * (MQ Message Descriptor) structure. See the
   * {@link https://www.ibm.com/support/knowledgecenter/en/SSFKSJ_latest/com.ibm.mq.ref.dev.doc/q097390_.htm|MQ Knowledge Center}
   * for more details on the usage of each field.
   * Not all of the underlying fields may be exposed in this object.
   */
  class MQMD {
    Report: number;
    MsgType: number;
    Expiry: number;
    Feedback: number;
    Encoding: MQC_MQENC;
    CodedCharSetId: MQC_MQCCSI;
    Format: Buffer;
    Priority: number;
    Persistence: number;
    MsgId: Buffer;
    CorrelId: Buffer;
    BackoutCount: number;
    ReplyToQ: string;
    ReplyToQMgr: string;
    UserIdentifier: string;
    AccountingToken: Buffer;
    ApplIdentityData: string;
    PutApplType: number;
    PutApplName: string;
    PutDate: string;
    PutTime: string;
    ApplOriginData: string;
    GroupId: Buffer;
    MsgSeqNumber: number;
    Offset: number;
    MsgFlags: number;
    OriginalLength: number;
  }

  enum MQ_SUITE {
    MQ_SUITE_B_NONE = 1,
    MQ_SUITE_B_NOT_AVAILABLE = 0,
  }

  /**
   * This is a class containing the fields needed for the MQOD
   * (MQ Object Descriptor) structure. See the
   * {@link https://www.ibm.com/support/knowledgecenter/en/SSFKSJ_latest/com.ibm.mq.ref.dev.doc/q098100_.htm|MQ Knowledge Center}
   * for more details on the usage of each field.
   * Not all of the underlying fields may be exposed in this object.
   */
  class MQOD {
    ObjectType: number;
    ObjectName: string;
    ObjectQMgrName: string;
    DynamicQName: string;
    AlternateUserId: string;
    AlternateSecurityId: Buffer;
    ResolvedQName: string;
    ResolvedQMgrName: string;
    ObjectString: string;
    SelectionString: string;
    ResObjectString: string;
    ResolvedType: number;
  }

  /**
   * This is a class containing the fields needed for the MQSCO
   * (MQ SSL/TLS Configuration Options) structure. See the
   * {@link https://www.ibm.com/support/knowledgecenter/en/SSFKSJ_latest/com.ibm.mq.ref.dev.doc/q099820_.htm|MQ Knowledge Center}
   * for more details on the usage of each field.
   * Note the warnings in the
   * {@link https://www.ibm.com/support/knowledgecenter/en/SSFKSJ_latest/com.ibm.mq.ref.dev.doc/q095520_.htm|MQ Knowledge Center}
   * about the process-wide, once-only definition of this structure and
   * the MQRC_SSL_ALREADY_INITIALIZED warning reason code.
   */
  class MQSCO {
    KeyRepository: string;
    CryptoHardware: string;
    KeyResetCount: number;
    FipsRequired: boolean;
    EncryptionPolicySuiteB: MQ_SUITE[];
    CertificateValPolicy: number;
    CertificateLabel: string;
  }

  /**
   * @property {number} getLoopPollTimeMs - Milliseconds between each full poll cycle.
   * Default is 10000 (10 seconds)
   * @property {number} getLoopDelayTimeMs - Milliseconds to delay after a partial poll cycle.
   * Default is 250 (1/4 second)
   * @property {number} maxConsecutiveGets - How many messages to get from a queue before trying a different queue.
   * Default is 100
   * @property {boolean} syncMQICompat - Make the MQI verbs all use the Synchronous model (the
   * original style for this package).
   * Default is false
   * @property {boolean} debugLog - Turn on debug logging dynamically.
   * Default is false
   */
  interface TuningParameters {
    getLoopPollTimeMs?: number;
    getLoopDelayTimeMs?: number;
    maxConsecutiveGets?: number;
    syncMQICompat?: boolean;
    debugLongCalls?: boolean;
    debugLog?: boolean;
  }

  /**
   * MQError holds the MQRC and MQCC values returned from an MQI verb.
   * For convenience, it also holds the name of the verb that failed.
   * It is a subclass of Error(). A pre-formatted error message is available
   * from this class, but individual fields are also accessible for applications that
   * want to handle errors fully themselves.
   *
   * @implements {Error}
   */
  class MQError extends Error {
    constructor(mqcc: number, mqrc: number, verb: string);
    mqcc: number;
    mqccstr: string;
    mqrc: number;
    mqrcstr: string;
    version: string;
    verb: string;
  }

  /**
   * MQQueueManager contains the connection to the queue manager. Fields
   * in this object are not meant to be directly referenced by user applications..
   */
  class MQQueueManager {}

  /**
   * MQObject contains a reference to an open object and the associated
   * queue manager. Fields in this object are not meant to be directly referenced
   * by user applications. Combining hConn and hObj in a single object means
   * we can simplify the API.
   */
  class MQObject {}

  /**
   * setTuningParameters - Override values used to tune behaviour
   * <p>These properties affect the "fairness" heuristics that manage the
   * scheduling of message retrieval in a high-workload system.
   *
   * @throws {TypeError}
   * When the parameter or its properties is of incorrect type
   * @example
   * console.log("Tuning parms are %j",mq.getTuningParameters());
   * mq.setTuningParameters({maxConsecutiveGets:20});
   * console.log("Tuning parms are now %j",mq.getTuningParameters());
   */
  function setTuningParameters(parms: TuningParameters);

  /**
   * PutSync -  Put a message to a queue or publish to a topic.
   *
   * @param {MQObject}
   * jsObject - reference to the opened object (hConn and hObj)
   * @param {MQMD}
   * jsmd - the message Descriptor
   * @param {MQPMO}
   * jspmo - Put Message Options
   * @param {Object}
   * buf - containing the message contents. Can be a String or Buffer
   * @param {function}
   * callback - optional. Invoked for errors. No additional parameter
   * on success.
   * @throws {MQError}
   * Container for MQRC and MQCC values
   * @throws {TypeError}
   * When a parameter is of incorrect type
   */
  function PutSync(
    jsObject: MQObject,
    jsmd: MQMD,
    jspmo: MQPMO,
    buf: string | Buffer,
    cb?: (err: MQError) => void
  ): void;

  /**
   * Put -  Put a message to a queue or publish to a topic.
   *
   * @param {MQObject}
   * jsObject - reference to the opened object (hConn and hObj)
   * @param {MQMD}
   * jsmd - the message Descriptor
   * @param {MQPMO}
   * jspmo - Put Message Options
   * @param {Object}
   * buf - containing the message contents. Can be a String or Buffer
   * @param {function}
   * callback - Invoked for errors. No additional parameter
   * on success.
   * @throws {MQError}
   * Container for MQRC and MQCC values
   * @throws {TypeError}
   * When a parameter is of incorrect type
   */
  function Put(
    jsObject: MQObject,
    jsmd: MQMD,
    jspmo: MQPMO,
    buf: string | Buffer,
    cb: (err: MQError) => void
  ): void;

  /**
   * Put1, Put1Sync -  Put a message to a queue or publish to a topic.
   *
   * <p>Put1 puts a single messsage to a queue or topic. Typically used
   * for one-shot replies where it can be cheaper than multiple
   * Open/Put/Close sequences
   *
   * @param {MQQueueManager}
   *        queueManager - reference to the queue manager (hConn)
   * @param {MQOD}
   *        jsod - MQ Object Descriptor including the name and
   *        type of object to open
   * @param {MQMD}
   *        jsmd - the message Descriptor
   * @param {MQPMO}
   *        jspmo - Put Message Options
   * @param {Object}
   *        buf - containing the message contents. Can be a String or Buffer
   * @param {function}
   *        callback - optional. Invoked for errors. No additional parameter
   *        on success.
   * @throws {MQError}
   *         Container for MQRC and MQCC values
   * @throws {TypeError}
   *         When a parameter is of incorrect type
   */
  function Put1Sync(
    jsQueueManager: MQQueueManager,
    jsod: MQOD,
    jsmd: MQMD,
    jspmo: MQPMO,
    buf: string | Buffer,
    cb?: (err: MQError) => void
  ): void;

  /**
   * Put1, Put1Sync -  Put a message to a queue or publish to a topic.
   *
   * <p>Put1 puts a single messsage to a queue or topic. Typically used
   * for one-shot replies where it can be cheaper than multiple
   * Open/Put/Close sequences
   *
   * @param {MQQueueManager}
   *        queueManager - reference to the queue manager (hConn)
   * @param {MQOD}
   *        jsod - MQ Object Descriptor including the name and
   *        type of object to open
   * @param {MQMD}
   *        jsmd - the message Descriptor
   * @param {MQPMO}
   *        jspmo - Put Message Options
   * @param {Object}
   *        buf - containing the message contents. Can be a String or Buffer
   * @param {function}
   *        callback - Invoked for errors. No additional parameter
   *        on success.
   * @throws {MQError}
   *         Container for MQRC and MQCC values
   * @throws {TypeError}
   *         When a parameter is of incorrect type
   */
  function Put1(
    jsQueueManager: MQQueueManager,
    jsod: MQOD,
    jsmd: MQMD,
    jspmo: MQPMO,
    buf: string | Buffer,
    cb: (err: MQError) => void
  ): void;

  /**
   * GetSync -  Get a message from a queue synchronously.
   *
   * <p>Note that this function will block until the MQGET returns.
   *
   * @param {MQObject}
   *        jsObject - reference to the opened object (hConn and hObj)
   * @param {MQMD}
   *        jsmd - the message Descriptor
   * @param {MQGMO}
   *        jsgmo - Get Message Options
   * @param {Buffer}
   *        buf - to contain the message contents
   * @param {function}
   *        callback - optional. Invoked for errors. Length of returned data
   *        passed on success.
   * @return {number} Length of returned message.
   * @throws {MQError}
   *         Container for MQRC and MQCC values
   * @throws {TypeError}
   *         When a parameter is of incorrect type
   */
  function GetSync(
    jsObject: MQObject,
    jsmd: MQMD,
    jsgmo: MQGMO,
    buf: Buffer,
    cb?: (err: MQError, jsDatalen: number) => void
  ): number | undefined;

  /**
   * Connx, ConnxSync - callback is passed object containing the hConn on success.
   *
   * @param {String}
   * qMgrName - the queue manager to connect to
   * @param {MQCNO}
   * cno - connection options
   * @param {function}
   * callback - optional. Invoked for errors and
   * with a reference to the qmgr connection.
   * @return {MQQueueManager} A reference to the connection
   * @throws {MQError}
   * Container for MQRC and MQCC values
   * @throws {TypeError}
   * When a parameter is of incorrect type
   */
  function ConnxSync(
    jsqMgrName: string,
    jsCno: MQCNO,
    cb?: (err: MQError, qmr: MQQueueManager) => void
  ): void;
  /**
   * Connx, ConnxSync - callback is passed object containing the hConn on success.
   *
   * @param {String}
   * qMgrName - the queue manager to connect to
   * @param {MQCNO}
   * cno - connection options
   * @param {function}
   * callback - Invoked for errors and
   * with a reference to the qmgr connection.
   * @return {MQQueueManager} A reference to the connection
   * @throws {MQError}
   * Container for MQRC and MQCC values
   * @throws {TypeError}
   * When a parameter is of incorrect type
   */
  function Connx(
    jsqMgrName: string,
    jsCno: MQCNO,
    cb: (err: MQError, qmr: MQQueueManager) => void
  ): void;

  /**
   * Conn, ConnSync - simpler version of Connx.
   * The callback is passed object containing the hConn on success
   *
   * @param {String}
   *        qMgrName - the queue manager to connect to
   * @param {function}
   *        callback - Invoked for errors and
   *        with a reference to the qmgr connection.
   * @return {MQQueueManager) A reference to the connection
   * @throws {MQError}
   *         Container for MQRC and MQCC values
   * @throws {TypeError}
   *         When a parameter is of incorrect type
   */
  function Conn(
    jsqMgrName: MQQueueManager,
    cb: (err: MQError, qmr: MQQueueManager) => void
  ): void;

  /**
   * Conn, ConnSync - simpler version of Connx.
   * The callback is passed object containing the hConn on success
   *
   * @param {String}
   *        qMgrName - the queue manager to connect to
   * @param {function}
   *        callback - optional. Invoked for errors and
   *        with a reference to the qmgr connection.
   * @return {MQQueueManager) A reference to the connection
   * @throws {MQError}
   *         Container for MQRC and MQCC values
   * @throws {TypeError}
   *         When a parameter is of incorrect type
   */
  function ConnSync(
    jsqMgrName: MQQueueManager,
    cb?: (err: MQError, qmr: MQQueueManager) => void
  ): void;

  /**
   * Disc, DiscSync - Disconnect from the queue manager.
   *
   * @param {MQQueueManager}
   * queueManager - reference to the queue manager
   * @param {function}
   * callback - optional. Invoked for errors.
   * @throws {MQError}
   * Container for MQRC and MQCC values
   * @throws {TypeError}
   * When a parameter is of incorrect type
   */
  function DiscSync(
    jsQueueManager: MQQueueManager,
    cb?: (err: MQError) => void
  );
  /**
   * Disc, DiscSync - Disconnect from the queue manager.
   *
   * @param {MQQueueManager}
   * queueManager - reference to the queue manager
   * @param {function}
   * callback - Invoked for errors.
   * @throws {MQError}
   * Container for MQRC and MQCC values
   * @throws {TypeError}
   * When a parameter is of incorrect type
   */
  function Disc(
    jsQueueManager: MQQueueManager,
    cb: (err: MQError) => void
  ): void;

  /**
   * Open, OpenSync - Open an object such as a queue or topic.
   *
   * @param {MQQueueManager}
   * queueManager - reference to the queue manager (hConn)
   * @param {MQOD}
   * jsod - MQ Object Descriptor including the name and
   * type of object to open
   * @param {number}
   * openOptions - how the object is intended to be used.
   * @param {function}
   * callback - Required. Invoked for errors and given a
   * reference to the opened object on success.
   * @return {MQObject} A reference to the opened object (hObj)
   * @throws {MQError}
   * Container for MQRC and MQCC values
   * @throws {TypeError}
   * When a parameter is of incorrect type
   */
  function OpenSync(
    jsQueueManager: MQQueueManager,
    jsod: MQOD,
    jsOpenOptions: MQC_MQOO,
    cb: (err: MQError, obj: MQObject) => void
  );

  /**
   * Open, OpenSync - Open an object such as a queue or topic.
   *
   * @param {MQQueueManager}
   * queueManager - reference to the queue manager (hConn)
   * @param {MQOD}
   * jsod - MQ Object Descriptor including the name and
   * type of object to open
   * @param {number}
   * openOptions - how the object is intended to be used.
   * @param {function}
   * callback - Required. Invoked for errors and given a
   * reference to the opened object on success.
   * @return {MQObject} A reference to the opened object (hObj)
   * @throws {MQError}
   * Container for MQRC and MQCC values
   * @throws {TypeError}
   * When a parameter is of incorrect type
   */
  function Open(
    jsQueueManager: MQQueueManager,
    jsod: MQOD,
    jsOpenOptions: MQC_MQOO,
    cb: (err: MQError, obj: MQObject) => void
  ): void;

  /**
   * Close, CloseSync - Close an opened object.
   *
   * @param {MQObject}
   * jsObject - reference to the object (contains hConn and hObj)
   * @param {number}
   * closeOptions
   * @param {function}
   * callback - optional. Invoked for errors. No additional parameters
   * on success.
   * @throws {MQError}
   * Container for MQRC and MQCC values
   * @throws {TypeError}
   * When a parameter is of incorrect type
   */
  function CloseSync(
    jsObject: MQObject,
    jsCloseOptions: MQC_MQCO,
    cb?: (err: MQError) => void
  );
  /**
   * Close, CloseSync - Close an opened object.
   *
   * @param {MQObject}
   * jsObject - reference to the object (contains hConn and hObj)
   * @param {number}
   * closeOptions
   * @param {function}
   * callback - Invoked for errors. No additional parameters
   * on success.
   * @throws {MQError}
   * Container for MQRC and MQCC values
   * @throws {TypeError}
   * When a parameter is of incorrect type
   */
  function Close(
    jsObject: MQObject,
    jsCloseOptions: MQC_MQCO,
    cb: (err: MQError) => void
  ): void;

  /**
   * Stat  - Get status of operations
   *
   * @param {MQQueueManager}
   *        queueManager - reference to the queue manager (hConn)
   * @param {number}
   *        type - type of status being requested (MQSTAT_TYPE_*)
   * @param {function}
   *        callback - optional. Invoked for errors and with the status
   *        response structure.
   * @returns {MQSTS}
   * @throws {MQError}
   *         Container for MQRC and MQCC values
   * @throws {TypeError}
   *         When a parameter is of incorrect type
   */
  function Stat(
    jsQueueManager: MQQueueManager,
    jsType: MQC_MQSTAT,
    cb: (err: MQError, status: MQC_MQSTS) => void
  );

  function ConnPromise(jsqMgrName: string): Promise<MQQueueManager>;

  function ConnxPromise(
    jsqMgrName: string,
    jsCno: MQCNO
  ): Promise<MQQueueManager>;

  function DiscPromise(jsQueueManager: MQQueueManager): Promise<void>;

  function OpenPromise(
    jsQueueManager: MQQueueManager,
    jsod: MQOD,
    jsOpenOptions: MQC_MQOO
  ): Promise<MQObject>;

  function ClosePromise(
    jsObject: MQObject,
    jsCloseOptions: MQC_MQCO
  ): Promise<void>;

  function PutPromise(
    jsObject: MQObject,
    jsmd: MQMD,
    jspmo: MQPMO,
    buf: string | Buffer
  ): Promise<void>;

  function Put1Promise(
    jsQueueManager: MQQueueManager,
    jsod: MQOD,
    jsmd: MQMD,
    jspmo: MQPMO,
    buf: string | Buffer
  ): Promise<void>;
}

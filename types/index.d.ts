declare module "ibmmq" {
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
   * getTuningParameters
   * @return Object containing the current values
   */
  function getTuningParameters(): TuningParameters;

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
   * MQAttr contains information about object attributes used in Set (MQSET)
   * and Inq (MQINQ) operations.
   * @class
   */
  class MQAttr {
    constructor(selector: MQC_MQCA | MQC_MQIA, value?: MQC_MQQA | string);
    /** The MQIA/MQCA selector value. For example MQIA_INHIBIT_PUT
     */
    selector: MQC_MQCA | MQC_MQIA;
    /**
    The "value" is optional in the constructor when making Inq() calls.
    */
    value: number | string;
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
    constructor(mqcc: MQC_MQCC, mqrc: MQC_MQRC | MQC_MQRCCF, verb: string);
    mqcc: MQC_MQCC;
    mqccstr: string;
    mqrc: MQC_MQRC | MQC_MQRCCF;
    mqrcstr: string;
    version: string;
    verb: string;
  }

  /**
   * Lookup returns the string corresponding to a value. For example,
   * convert 2195 to MQRC_UNEXPECTED_ERROR.
   *
   * <p>Note: Unlike the Java equivalent, this does not accept regular expressions
   * for the range. It must be an explicit value.
   *
   * @param {String}
   *        range - eg "MQRC" or "MQIA"
   * @param {int}
   *        value - the value to convert
   * @return {String} The string or null if no matching value or range.
   *
   */
  function Lookup(range: string, val: number): string | null;

  /**
   * ConnxSync - callback is passed object containing the hConn on success.
   *
   * @param {String}
   *        qMgrName - the queue manager to connect to
   * @param {MQCNO}
   *        cno - connection options
   * @param {function}
   *        callback - optional. Invoked for errors and
   *        with a reference to the qmgr connection.
   * @throws {MQError}
   *         Container for MQRC and MQCC values
   * @throws {TypeError}
   *         When a parameter is of incorrect type
   */
  function ConnxSync(
    jsqMgrName: string,
    jsCno: MQCNO,
    cb?: (err: MQError | null, qmr: MQQueueManager) => void
  ): void;

  /**
   * Connx - callback is passed object containing the hConn on success.
   *
   * @param {String}
   *        qMgrName - the queue manager to connect to
   * @param {MQCNO}
   *        cno - connection options
   * @param {function}
   *        callback - Invoked for errors and
   *        with a reference to the qmgr connection.
   * @throws {MQError}
   *         Container for MQRC and MQCC values
   * @throws {TypeError}
   *         When a parameter is of incorrect type
   */
  function Connx(
    jsqMgrName: string,
    jsCno: MQCNO,
    cb: (err: MQError | null, qmr: MQQueueManager) => void
  ): void;

  /**
   * Conn - simpler version of Connx.
   * The callback is passed object containing the hConn on success
   *
   * @param {String}
   *        qMgrName - the queue manager to connect to
   * @param {function}
   *        callback - Invoked for errors and
   *        with a reference to the qmgr connection.
   * @throws {MQError}
   *         Container for MQRC and MQCC values
   * @throws {TypeError}
   *         When a parameter is of incorrect type
   */
  function Conn(
    jsqMgrName: string,
    cb: (err: MQError | null, qmr: MQQueueManager) => void
  ): void;

  /**
   * ConnSync - simpler version of Connx.
   * The callback is passed object containing the hConn on success
   *
   * @param {String}
   *        qMgrName - the queue manager to connect to
   * @param {function}
   *        callback - optional. Invoked for errors and
   *        with a reference to the qmgr connection.
   * @throws {MQError}
   *         Container for MQRC and MQCC values
   * @throws {TypeError}
   *         When a parameter is of incorrect type
   */
  function ConnSync(
    jsqMgrName: string,
    cb?: (err: MQError | null, qmr: MQQueueManager) => void
  ): void;

  /**
   * DiscSync - Disconnect from the queue manager.
   *
   * @param {MQQueueManager}
   *        queueManager - reference to the queue manager
   * @param {function}
   *        callback - optional. Invoked for errors.
   * @throws {MQError}
   *         Container for MQRC and MQCC values
   * @throws {TypeError}
   *         When a parameter is of incorrect type
   */
  function DiscSync(
    jsQueueManager: MQQueueManager,
    cb?: (err: MQError | null) => void
  );

  /**
   * Disc - Disconnect from the queue manager.
   *
   * @param {MQQueueManager}
   *        queueManager - reference to the queue manager
   * @param {function}
   *        callback - optional. Invoked for errors.
   * @throws {MQError}
   *         Container for MQRC and MQCC values
   * @throws {TypeError}
   *         When a parameter is of incorrect type
   */
  function Disc(
    jsQueueManager: MQQueueManager,
    cb?: (err: MQError | null) => void
  ): void;

  /**
   * OpenSync - Open an object such as a queue or topic.
   *
   * @param {MQQueueManager}
   *        queueManager - reference to the queue manager (hConn)
   * @param {MQOD}
   *        jsod - MQ Object Descriptor including the name and
   *        type of object to open
   * @param {number}
   *        openOptions - how the object is intended to be used.
   * @param {function}
   *        callback - Required. Invoked for errors and given a
   *        reference to the opened object on success.
   * @throws {MQError}
   *          Container for MQRC and MQCC values
   * @throws {TypeError}
   *          When a parameter is of incorrect type
   */
  function OpenSync(
    jsQueueManager: MQQueueManager,
    jsod: MQOD,
    jsOpenOptions: MQC_MQOO,
    cb: (err: MQError | null, obj: MQObject) => void
  );

  /**
   * Open - Open an object such as a queue or topic.
   *
   * @param {MQQueueManager}
   *        queueManager - reference to the queue manager (hConn)
   * @param {MQOD}
   *        jsod - MQ Object Descriptor including the name and
   *        type of object to open
   * @param {number}
   *        openOptions - how the object is intended to be used.
   * @param {function}
   *        callback - Required. Invoked for errors and given a
   *        reference to the opened object on success.
   * @throws {MQError}
   *          Container for MQRC and MQCC values
   * @throws {TypeError}
   *          When a parameter is of incorrect type
   */
  function Open(
    jsQueueManager: MQQueueManager,
    jsod: MQOD,
    jsOpenOptions: MQC_MQOO,
    cb: (err: MQError | null, obj: MQObject) => void
  ): void;

  /**
   * Close, CloseSync - Close an opened object.
   *
   * @param {MQObject}
   *        jsObject - reference to the object (contains hConn and hObj)
   * @param {number}
   *        closeOptions
   * @param {function}
   *        callback - optional. Invoked for errors. No additional parameters
   *        on success.
   * @throws {MQError}
   *         Container for MQRC and MQCC values
   * @throws {TypeError}
   *         When a parameter is of incorrect type
   */
  function CloseSync(
    jsObject: MQObject,
    jsCloseOptions: MQC_MQCO,
    cb?: (err: MQError | null) => void
  );

  /**
   * Close, CloseSync - Close an opened object.
   *
   * @param {MQObject}
   *        jsObject - reference to the object (contains hConn and hObj)
   * @param {number}
   *        closeOptions
   * @param {function}
   *        callback - Invoked for errors. No additional parameters
   *        on success.
   * @throws {MQError}
   *         Container for MQRC and MQCC values
   * @throws {TypeError}
   *         When a parameter is of incorrect type
   */
  function Close(
    jsObject: MQObject,
    jsCloseOptions: MQC_MQCO,
    cb: (err: MQError | null) => void
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
    cb?: (err: MQError | null, mqsts: MQSTS) => void
  ): MQSTS | undefined;

  /**
   * Begin - Start a global transaction.
   *
   * @param {MQQueueManager}
   *        queueManager - reference to the queue manager (hConn)
   * @param {function}
   *        callback - optional. Invoked for errors. No additional parameter
   *        on success.
   * @throws {MQError}
   *         Container for MQRC and MQCC values
   * @throws {TypeError}
   *         When a parameter is of incorrect type
   */
  function Begin(
    jsQueueManager: MQQueueManager,
    cb?: (err: MQError | null) => void
  ): void;

  /**
   * Cmit - Commit an in-flight transaction.
   *
   * @param {MQQueueManager}
   *        queueManager - reference to the queue manager (hConn)
   * @param {function}
   *        callback - optional. Invoked for errors. No additional parameter
   *        on success.
   * @throws {MQError}
   *         Container for MQRC and MQCC values
   * @throws {TypeError}
   *         When a parameter is of incorrect type
   */
  function Cmit(
    jsQueueManager: MQQueueManager,
    cb?: (err: MQError | null) => void
  ): void;

  /**
   * Back - Backout an in-flight transaction.
   *
   * @param {MQQueueManager}
   *        queueManager - reference to the queue manager (hConn)
   * @param {function}
   *        callback - optional. Invoked for errors. No additional parameter
   *        on success.
   * @throws {MQError}
   *         Container for MQRC and MQCC values
   * @throws {TypeError}
   *         When a parameter is of incorrect type
   */
  function Back(
    jsQueueManager: MQQueueManager,
    cb?: (err: MQError | null) => void
  ): void;

  /**
   * SubSync - Subscribe to a topic.
   * If using managed destinations where the queue manager creates a
   * queue on your behalf, the reference to it is given to the callback
   * function.
   *
   * @param {MQQueueManager}
   *        queueManager - reference to the queue manager (hConn)
   * @param {MQObject}
   *        queueObject - the queue to which publications will be
   *        delivered. Can be null to indicate a managed queue should
   *        be allocated.
   * @param {MQSD}
   *        jssd - MQ Subscription Descriptor including the topic to be
   *        subscribed.
   * @param {function}
   *        callback - Optional. Invoked for errors. On success, given a
   *        reference to the opened subscription and the opened queue.
   * @throws {MQError}
   *         Container for MQRC and MQCC values
   * @throws {TypeError}
   *         When a parameter is of incorrect type
   */
  function SubSync(
    jsQueueManager: MQQueueManager,
    jsQueueObject: MQObject,
    jssd: MQSD,
    cb?: (
      err: MQError,
      jsPublicationQueueObject: MQObject,
      jsSubObject: MQObject
    ) => void
  ): void;

  /**
   * Sub - Subscribe to a topic.
   * If using managed destinations where the queue manager creates a
   * queue on your behalf, the reference to it is given to the callback
   * function.
   *
   * @param {MQQueueManager}
   *        queueManager - reference to the queue manager (hConn)
   * @param {MQObject}
   *        queueObject - the queue to which publications will be
   *        delivered. Can be null to indicate a managed queue should
   *        be allocated.
   * @param {MQSD}
   *        jssd - MQ Subscription Descriptor including the topic to be
   *        subscribed.
   * @param {function}
   *        callback - Invoked for errors. On success, given a
   *        reference to the opened subscription and the opened queue.
   * @throws {MQError}
   *         Container for MQRC and MQCC values
   * @throws {TypeError}
   *         When a parameter is of incorrect type
   */
  function Sub(
    jsQueueManager: MQQueueManager,
    jsQueueObject: MQObject,
    jssd: MQSD,
    cb: (
      err: MQError,
      jsPublicationQueueObject: MQObject,
      jsSubObject: MQObject
    ) => void
  ): void;

  /**
   * Subrq - Request retained publications
   *
   * @param {MQQueueManager}
   *        queueManager - reference to the queue manager (hConn)
   * @param {MQObject}
   *        subObject - handle representing a subscription made earlier by
   *        a call to the Sub() method.
   * @param {number}
   *        action - what to do
   * @param {MQSRO}
   *        jssro - MQ Subscription Request Options
   * @param {function}
   *        callback - optional. Invoked for errors.
   * @throws {MQError}
   *         Container for MQRC and MQCC values
   * @throws {TypeError}
   *         When a parameter is of incorrect type
   */
  function Subrq(
    jsQueueManager: MQQueueManager,
    jsSubObject: MQObject,
    jsaction: MQC_MQSR,
    jssro: MQSRO,
    cb?: (err: MQError | null) => void
  ): void;

  /**
   * PutSync -  Put a message to a queue or publish to a topic.
   *
   * @param {MQObject}
   *        jsObject - reference to the opened object (hConn and hObj)
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
  function PutSync(
    jsObject: MQObject,
    jsmd: MQMD,
    jspmo: MQPMO,
    buf: string | Buffer,
    cb?: (err: MQError | null) => void
  ): void;

  /**
   * Put -  Put a message to a queue or publish to a topic.
   *
   * @param {MQObject}
   *        jsObject - reference to the opened object (hConn and hObj)
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
  function Put(
    jsObject: MQObject,
    jsmd: MQMD,
    jspmo: MQPMO,
    buf: string | Buffer,
    cb: (err: MQError | null) => void
  ): void;

  /**
   * Put1Sync -  Put a message to a queue or publish to a topic.
   *
   * Put1 puts a single messsage to a queue or topic. Typically used
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
    cb?: (err: MQError | null) => void
  ): void;

  /**
   * Put1 -  Put a message to a queue or publish to a topic.
   *
   * Put1 puts a single messsage to a queue or topic. Typically used
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
    cb: (err: MQError | null) => void
  ): void;

  /**
   * GetSync -  Get a message from a queue synchronously.
   *
   * Note that this function will block until the MQGET returns.
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
    cb?: (err: MQError | null, jsDatalen: number) => void
  ): number | undefined;

  /**
   * Get -  Get a message from a queue asynchronously. Use GetDone()
   * to clear the callback. No data buffer needs to be supplied as input to
   * this function, but message data and the MQMD should be processed or copied
   * before returning from your callback.
   *
   * In particular, Buffer datatypes need to be fully copied if you need the
   * contents later, do not just save a reference to them. For example, do
   *  'savedMsgId = Buffer.from(jsmd.MsgId)', not 'savedMsgId = jsmd.MsgId'
   *
   * Note that calling another asynchronous operation within your callback
   * is likely to cause the callback to end before that operation is scheduled.
   * And then the MQMD or data buffer may get overwritten
   * by a subsequent message so that async operation may not see the expected data.
   *
   * The callback function is repetitively invoked for each message. You
   * do not need to reset after each retrieval.
   *
   * @param {MQObject}
   *        jsObject - reference to the opened object (hConn and hObj)
   * @param {MQMD}
   *        jsmd - the message Descriptor
   * @param {MQGMO}
   *        jsgmo - Get Message Options
   * @param {function}
   *        callback - Called when messages arrive. Parameters are
   *          (error, MQObject, MQGMO, MQMD, data, MQQueueManager)
   * @throws {MQError}
   *         Container for MQRC and MQCC values
   * @throws {TypeError}
   *         When a parameter is of incorrect type
   */
  function Get(
    jsObject: MQObject,
    jsmd: MQMD,
    jsgmo: MQGMO,
    cb: GetCallback
  ): void;

  interface GetCallback {
    (
      err: MQError,
      object: MQObject,
      gmo: null,
      md: null,
      data: null,
      mqQueueManager: MQQueueManager
    ): void;
    (
      err: null,
      object: MQObject,
      gmo: MQGMO,
      md: MQMD,
      data: Buffer | null,
      mqQueueManager: MQQueueManager
    ): void;
  }

  /**
   * GetDone -  Stop the Get processing by removing the listener
   * for more messages.
   *
   * @param {MQObject}
   *        jsObject - reference to the opened object (hConn and hObj)
   * @param {function}
   *        callback - Invoked for errors.
   * @throws {MQError}
   *         Container for MQRC and MQCC values
   * @throws {TypeError}
   *         When a parameter is of incorrect type
   */
  function GetDone(
    jsObject: MQObject,
    cb?: (err: MQError | null) => void
  ): void;

  /**
   * Inq - Inquire on attributes of an object
   *
   * @param {MQObject}
   *        object - reference to the object (hObj)
   * @param {Array.<MQAttr>}
   *        jsSelectors - Array containing the selectors naming the
   *        attributes to look for (MQIA*, MQCA* values). On completion
   *        the array elements are updated with the values.
   * @param {function}
   *        callback - Called when the inquire completes. Parameters are (error, jsSelectors)
   * @throws {MQError}
   *          Container for MQRC and MQCC values
   * @throws {TypeError}
   *          When a parameter is of incorrect type
   */
  function Inq(
    jsObject: MQObject,
    jsSelectors: MQAttr[],
    cb?: (err: MQError | null, jsSelectors: MQAttr[]) => void
  ): void;

  /**
   * Set - Set attributes of an object
   *
   * @param {MQObject}
   *        object - reference to the object (hObj) which must refer to a queue.
   * @param {Array<MQAttr>}
   *        jsSelectors - Array containing the attributes (name and value) that
   *        will be changed.
   * @param {function}
   *        callback - Called when the operation completes. Parameters are (error)
   * @throws {MQError}
   *          Container for MQRC and MQCC values
   * @throws {TypeError}
   *          When a parameter is of incorrect type
   */
  function Set(
    jsObject: MQObject,
    jsSelectors: MQAttr[],
    cb?: (err: MQError | null) => void
  ): void;

  type HMSG = object;

  /**
   * CrtMh - Create a message handle to manage properties
   *
   * @param {MQQueueManager}
   *        queueManager - reference to the queue manager
   * @param {MQCMHO}
   *        cmho - Options for handle creation
   * @param {function}
   *        callback - Called when the operation completes.
   *        Parameters are (error, message handle)
   * @return {Object} The created handle
   * @throws {MQError}
   *          Container for MQRC and MQCC values
   * @throws {TypeError}
   *          When a parameter is of incorrect type
   */
  function CrtMh(
    jsQueueManager: MQQueueManager,
    jscmho: MQCMHO,
    cb?: (err: MQError | null, jsHMsg: HMSG) => void
  ): HMSG | void;

  /**
   * DltMh - Delete a message handle
   *
   * @param {MQQueueManager}
   *        queueManager - reference to the queue manager
   * @param {Object}
   *        handle - message handle
   * @param {MQDMHO}
   *        dmho - Options for handle deletion
   * @param {function}
   *        callback - Called when the operation completes.
   *        Parameters are (error)
   * @throws {MQError}
   *        Container for MQRC and MQCC values
   * @throws {TypeError}
   *        When a parameter is of incorrect type
   */
  function DltMh(
    jsQueueManager: MQQueueManager,
    jsHMsg: HMSG,
    jsdmho: MQDMHO,
    cb?: (err: MQError | null) => void
  ): void;

  /**
   * SetMp - Set a property on a message
   * Use this to set the properties via a message handle, and then
   * pass the message handle as part of the MQPMO structure when putting
   * the message.
   *
   * @param {MQQueueManager}
   *        queueManager - reference to the queue manager
   * @param {Object}
   *        handle - message handle
   * @param {MQSMPO}
   *        smpo - Options for how the property is set
   * @param {String}
   *        name - the property name
   * @param {MQPD}
   *        pd - property descriptor
   * @param {Object}
   *        value - the property value. Can be number, string, boolean or null
   * @param {function}
   *        callback - Called when the operation completes.
   *        Parameters are (error)
   * @throws {MQError}
   *        Container for MQRC and MQCC values
   * @throws {TypeError}
   *        When a parameter is of incorrect type
   */
  function SetMp(
    jsQueueManager: MQQueueManager,
    jsHMsg: HMSG,
    jssmpo: MQSMPO,
    name: string,
    jspd: MQPD,
    value: number | string | boolean | Buffer | null,
    cb?: (err: MQError | null) => void
  ): void;

  /**
   * InqMp - Inquire on the values of a message property
   *
   * @param {MQQueueManager}
   *        queueManager - reference to the queue manager
   * @param {Object}
   *        handle - message handle
   * @param {MQIMPO}
   *        impo - Options for how the property is to be queried
   * @param {MQPD}
   *        pd - property descriptor
   * @param {String}
   *        name - the property name
   * @param {Buffer}
   *        value - buffer to be filled in with the property value if it's a
   *        string or byte array
   * @param {function}
   *        callback - Called when the operation completes.
   *        Parameters are (error,name,value,length,type). If the value is
   *        not a simple type (boolean, string, number) then the length and
   *        type parameters can be used for the application to decode the
   *        returned Buffer.
   * @throws {MQError}
   *          Container for MQRC and MQCC values
   * @throws {TypeError}
   *          When a parameter is of incorrect type
   */
  function InqMp(
    jsQueueManager: MQQueueManager,
    jsHMsg: HMSG,
    jsImpo: MQIMPO,
    jsPd: MQPD,
    jsName: string,
    valueBuffer?: Buffer,
    cb?: (
      err: MQError | null,
      name: string,
      value: boolean | string | number | Buffer | null,
      length: number,
      type: MQC_MQTYPE
    ) => void
  ): boolean | string | number | Buffer | null | void;

  /**
   * DltMp - Delete a message property
   *
   * @param {MQQueueManager}
   *        queueManager - reference to the queue manager
   * @param {Object}
   *        handle - message handle
   * @param {MQDMPO}
   *        dmpo - Options for how the property is to be deleted
   * @param {String}
   *        name - the property name
   * @param {function}
   *        callback - Called when the operation completes.
   *        Parameters are (error)
   * @throws {MQError}
   *        Container for MQRC and MQCC values
   * @throws {TypeError}
   *        When a parameter is of incorrect type
   */
  function DltMp(
    jsQueueManager: MQQueueManager,
    jsHMsg: HMSG,
    jsDmpo: MQDMPO,
    jsName: string,
    cb?: (err: MQError | null) => void
  ): void;

  /**
   * Conn - simpler version of Connx.
   * The callback is passed object containing the hConn on success
   *
   * @param {String}
   *        qMgrName - the queue manager to connect to
   * @throws {MQError}
   *         Container for MQRC and MQCC values
   * @throws {TypeError}
   *         When a parameter is of incorrect type
   */
  function ConnPromise(jsqMgrName: string): Promise<MQQueueManager>;

  /**
   * Connx - callback is passed object containing the hConn on success.
   *
   * @param {String}
   *        qMgrName - the queue manager to connect to
   * @param {MQCNO}
   *        cno - connection options
   * @throws {MQError}
   *         Container for MQRC and MQCC values
   * @throws {TypeError}
   *         When a parameter is of incorrect type
   */
  function ConnxPromise(
    jsqMgrName: string,
    jsCno: MQCNO
  ): Promise<MQQueueManager>;

  /**
   * Disc - Disconnect from the queue manager.
   *
   * @param {MQQueueManager}
   *        queueManager - reference to the queue manager
   * @throws {MQError}
   *         Container for MQRC and MQCC values
   * @throws {TypeError}
   *         When a parameter is of incorrect type
   */
  function DiscPromise(jsQueueManager: MQQueueManager): Promise<void>;

  /**
   * Open - Open an object such as a queue or topic.
   *
   * @param {MQQueueManager}
   *        queueManager - reference to the queue manager (hConn)
   * @param {MQOD}
   *        jsod - MQ Object Descriptor including the name and
   *        type of object to open
   * @param {number}
   *        openOptions - how the object is intended to be used.
   * @throws {MQError}
   *          Container for MQRC and MQCC values
   * @throws {TypeError}
   *          When a parameter is of incorrect type
   */
  function OpenPromise(
    jsQueueManager: MQQueueManager,
    jsod: MQOD,
    jsOpenOptions: MQC_MQOO
  ): Promise<MQObject>;

  /**
   * Close, CloseSync - Close an opened object.
   *
   * @param {MQObject}
   *        jsObject - reference to the object (contains hConn and hObj)
   * @param {number}
   *        closeOptions
   * @throws {MQError}
   *         Container for MQRC and MQCC values
   * @throws {TypeError}
   *         When a parameter is of incorrect type
   */
  function ClosePromise(
    jsObject: MQObject,
    jsCloseOptions: MQC_MQCO
  ): Promise<void>;

  /**
   * Put -  Put a message to a queue or publish to a topic.
   *
   * @param {MQObject}
   *        jsObject - reference to the opened object (hConn and hObj)
   * @param {MQMD}
   *        jsmd - the message Descriptor
   * @param {MQPMO}
   *        jspmo - Put Message Options
   * @param {Object}
   *        buf - containing the message contents. Can be a String or Buffer
   * @throws {MQError}
   *         Container for MQRC and MQCC values
   * @throws {TypeError}
   *         When a parameter is of incorrect type
   */
  function PutPromise(
    jsObject: MQObject,
    jsmd: MQMD,
    jspmo: MQPMO,
    buf: string | Buffer
  ): Promise<void>;

  /**
   * Put1Sync -  Put a message to a queue or publish to a topic.
   *
   * Put1 puts a single messsage to a queue or topic. Typically used
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
   * @throws {MQError}
   *         Container for MQRC and MQCC values
   * @throws {TypeError}
   *         When a parameter is of incorrect type
   */
  function Put1Promise(
    jsQueueManager: MQQueueManager,
    jsod: MQOD,
    jsmd: MQMD,
    jspmo: MQPMO,
    buf: string | Buffer
  ): Promise<void>;

  /**
   * Sub - Subscribe to a topic.
   * If using managed destinations where the queue manager creates a
   * queue on your behalf, the reference to it is given to the callback
   * function.
   *
   * @param {MQQueueManager}
   *        queueManager - reference to the queue manager (hConn)
   * @param {MQObject}
   *        queueObject - the queue to which publications will be
   *        delivered. Can be null to indicate a managed queue should
   *        be allocated.
   * @param {MQSD}
   *        jssd - MQ Subscription Descriptor including the topic to be
   *        subscribed.
   * @throws {MQError}
   *         Container for MQRC and MQCC values
   * @throws {TypeError}
   *         When a parameter is of incorrect type
   */
  function SubPromise(
    jsQueueManager: MQQueueManager,
    jsQueueObject: MQObject,
    jssd: MQSD
  ): Promise<{ hObj: MQObject; hSub: MQObject }>;
}

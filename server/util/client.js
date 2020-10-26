const net = require("net");
const crypto = require("crypto");

/**
 * Class used to represent a queue of messages to be sent to the language server.
 *
 * @class Queue
 */
class Queue {
  /**
   * Creates an instance of Queue.
   * @memberof Queue
   */
  constructor() {
    // Queue containing all messages
    this.msgQueue = [];
    this.queueLen = 0;
  }

  /**
   * Check if the queue is empty.
   *
   * @return {boolean} True or false indicating if the queue is empty.
   * @memberof Queue
   */
  isEmpty() {
    return this.queueLen == 0;
  }

  /**
   * Add a new message to the queue.
   *
   * @param {string} msg Message to be added to the queue.
   * @memberof Queue
   */
  addMessage(msg) {
    this.msgQueue.push(msg);
    this.queueLen += 1;
  }

  /**
   * Get the next message from the queue.
   *
   * @return {string | undefined} Either a string containing the message or undefined if queue is empty.
   * @memberof Queue
   */
  getMessage() {
    if (this.queueLen > 0) {
      let msg = this.msgQueue.shift();
      this.queueLen -= 1;
      return msg;
    }
    return undefined;
  }
}

/**
 * Class representing a single instance of an interpreter client.
 * This class is used to control an instance by sending/receiving/killing a
 * particular language server.
 *
 * @class Interpreter
 */
class Interpreter {
  /**
   * Creates an instance of Interpreter.
   * The client will attempt to connect at most 10 times to a server.
   * Each connection retry is done every 0.5 seconds.
   * @param {number} portNum The port number to open a connection on.
   * @param {string} interpName The name of the interpreter this class is representing.
   * @param {eventEmitter} eventEmitter An eventEmitter instance used to emit responses from the server.
   * @memberof Interpreter
   */
  constructor(portNum, interpName, eventEmitter) {
    this.name = interpName;
    this.msgQueue = new Queue();
    // Event emitter used to notify server when a request is completed and result
    // can be sent back to caller
    this.emitter = eventEmitter;
    // Indicate that the socket is still open
    this.sockStatus = false;
    // Flag indicating whether we are waiting for a response from the server
    this.isWaiting = false;
    // The current hash of the message for which we are waiting for a response to
    this.currentHash = undefined;
    // The socket used to make a connection
    this.socket = new net.Socket();
    // The number of attempts tried to connect
    this.retryAttempNum = 0;
    // Max number of attempts tried
    this.maxRetryAttempt = 10;

    this.socket.on("connect", () => {
      this.sockStatus = true;
      console.log(`Connected to server on port ${portNum}!`);
      this.sendMsg();
    });

    // If an "error" event is emitted, the connection could not be established.
    // Src: https://stackoverflow.com/questions/25791436/reconnect-net-socket-nodejs
    this.socket.on("error", () => {
      // If we are not connected to a server, attempt to connect again
      if (!this.sockStatus && this.retryAttempNum < this.maxRetryAttempt) {
        console.log("Trying to reconnect!", this.retryAttempNum);
        this.retryAttempNum += 1;
        // Retry to connect in 0.5 seconds
        setTimeout(() => {
          this.socket.connect(portNum, "127.0.0.1");
        }, 500);
      }
      // TODO: Signal to return port number!
      console.log("Failed to connect after", this.retryAttempNum);
    });

    this.socket.on("data", (data) => {
      this.recv_data(data);
    });

    this.socket.on("close", () => {
      console.log("close called");
      // TODO: Signal to return port number!
    });

    console.log("Trying to connect for first time!");
    this.socket.connect(portNum, "127.0.0.1");
  }

  /**
   * Send the next message in the queue to the language server.
   *
   * @memberof Interpreter
   */
  sendMsg() {
    if (!this.msgQueue.isEmpty()) {
      // Retrieve next message
      let [hash, msg] = this.msgQueue.getMessage();

      this.isWaiting = true;
      this.currentHash = hash;
      this.socket.write(JSON.stringify(msg));
    }
  }

  /**
   * Handle the data returned by the language server and send next message.
   * The data is provided to the caller by emitting an event bound to the hash
   * of a message generate when calling "runCode" method.
   * @param {JSON} data JSON response containing stdout/stderr generated from executing  a command.
   * @memberof Interpreter
   */
  recv_data(data) {
    // Send out data
    this.emitter.emit(this.currentHash, data);
    console.log("received", data.toString("utf-8"));

    this.sendMsg();
  }

  /**
   * Calculate the SHA256 hash of a string containing language instructions.
   * The hash is generated by creating a new string containing the current
   * time in milliseconds, the name of the interpreter running the command
   * and the string of instructions. The hash is created using SHA256.
   *
   * @param {string} codeStr Contains the instructions to be executed.
   * @return {string} The SHA256 hash in hex identifying the command to be sent.
   * @memberof Interpreter
   */
  calcHash(codeStr) {
    let currTime = Date.now().toString();
    let hashInputStr = currTime + this.interpName + codeStr;
    let uniqueHash = crypto
      .createHash("sha256")
      .update(hashInputStr)
      .digest("hex");
    return uniqueHash;
  }

  /**
   * Check if the interpreter connection is still alive.
   *
   * @return {boolean} Boolean status indicating whether the conneciton is still open.
   * @memberof Interpreter
   */
  isLive() {
    return this.sockStatus;
  }

  /**
   * Kill the language server and its client.
   *
   * @memberof Interpreter
   */
  kill() {
    this.socket.destroy();
  }

  /**
   * Add a string of instructions to the message queue and send it to the server.
   *
   * @param {string} data Instructions to be sent.
   * @return {string} SHA256 hash used to emit an event containing the server's response.
   * @memberof Interpreter
   */
  runCode(data) {
    let codeObj = { type: "RUN", code: data };
    let codeHash = this.calcHash(data);
    // If the socket is not open yet or we are waiting for a message response,
    // append the new message to the message queue.
    if (!this.sockStatus || this.isWaiting) {
      this.msgQueue.addMessage([codeHash, codeObj]);
    } else {
      // If not busy, send off code object to server and return code hash
      this.sendMsg();
    }
    return codeHash;
  }
}

module.exports.Interpreter = Interpreter;

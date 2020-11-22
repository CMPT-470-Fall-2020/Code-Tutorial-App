const net = require("net");
const { MessageQueue } = require("./message_queue");
const crypto = require("crypto");
const { log } = require("util");

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
  constructor(portNum, interpName, eventEmitter, dockerInstance) {
    // The name of the interpreter instance.
    this.interpName = interpName;
    this.portNum = portNum;
    // A queue containing all messages which need to be sent.
    this.msgQueue = new MessageQueue();
    // Event emitter used to notify server when a request is completed and result
    // can be sent back to caller
    this.emitter = eventEmitter;
    this.dockerInstance = dockerInstance;
    // The current hash of the message for which we are waiting for a response to
    this.currentHash = "";
    // The socket used to make a connection
    this.socket = new net.Socket();

    // FLAGS
    // Indicate that the socket is still open
    this.connStatus = false;
    // Flag indicating whether we are waiting for a response from the server
    this.isWaiting = false;
    // The number of attempts tried to connect
    this.retryAttempNum = 0;
    // Max number of attempts tried
    this.maxRetryAttempt = 10;

    this.socket.on("connect", () => {
      this.connStatus = true;
      console.log(`Connected to server on port ${portNum}!`);
      this.sendMsg();
    });

    // If an "error" event is emitted, the connection could not be established.
    // Src: https://stackoverflow.com/questions/25791436/reconnect-net-socket-nodejs
    this.socket.on("error", () => {
      // If we are not connected to a server, attempt to connect again
      if (!this.connStatus && this.retryAttempNum < this.maxRetryAttempt) {
        console.log(
          `CLIENT: Trying to reconnect. Retry #: ${this.retryAttempNum}`
        );
        this.retryAttempNum += 1;
        // Retry to connect in 0.5 seconds
        setTimeout(() => {
          this.socket.connect(portNum, "127.0.0.1");
        }, 500);
      }
      // If there is an issue with the socket, we kill the server process.
      // This will then emit an event which frees up the port.
      //console.log("CLIENT: Killing child process due to socket error.");
      //this.serverProcess.kill()
    });

    this.socket.on("data", (data) => {
      console.log("CLIENT: Received response from language server.");
      this.processResponse(data);
    });

    // Start the docker instance
    this.dockerInstance.startInstance(() => {
      console.log("CONNECT CALLBACK FROM CLIENT: ", this.portNum);
      this.connectToServer();
    });
  }

  connectToServer() {
    console.log(
      "CLIENT: Client trying to connect with port num:",
      this.portNum
    );
    // Attempt to connect for the first time. If it does not succeed, retry 10 times on 0.5 sec intervals.
    this.socket.connect(this.portNum, "127.0.0.1");
  }
  /**
   * Send the next message in the queue to the language server.
   *
   * @memberof Interpreter
   */
  sendMsg() {
    console.log("CLIENT: Message queue called in sendMsg");
    if (!this.msgQueue.isEmpty()) {
      // Retrieve next message
      let [hash, msg] = this.msgQueue.getMessage();
      console.log("CLIENT: Sending a new message to client", msg);

      this.isWaiting = true;
      this.currentHash = hash;
      let msgStatus = this.socket.write(JSON.stringify(msg));
      console.log("CLIENT: sendMsg sent a message with status", msgStatus);
      return;
    }
    console.log("CLIENT: Message queue had other messages in sendMsg");
  }

  /**
   * Handle the data returned by the language server and send next message.
   * The data is provided to the caller by emitting an event bound to the hash
   * of a message generate when calling "runCode" method.
   * @param {JSON} data JSON response containing stdout/stderr generated from executing  a command.
   * @memberof Interpreter
   */
  processResponse(data) {
    let resp = JSON.parse(data.toString("utf-8"));
    switch (resp["type"]) {
      case "SUCCESS":
        // Reset the hash. In case there is a crash, we do not want to send a packet to an outdated hash.
        console.log(
          "CLIENT: Received response from server. About to emit event",
          resp
        );
        this.emitter.emit(this.currentHash, resp);
        // this.currentHash = "";
        break;
      case "CONNECTION-OK":
        break;
      case "CONNECTION-ERROR":
        this.killServer();
        break;
      default:
        console.log("This should not happen!");
    }
    if (this.msgQueue.isEmpty()) {
      this.isWaiting = false;
    } else {
      this.sendMsg();
    }
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
    return this.connStatus;
  }

  /**
   * Kill the language server and its client immediately.
   *
   * @memberof Interpreter
   */
  killServer() {
    // If we are waiting for a response from the server, we kill it immediately.
    // There we are not waiting for a response, send a "KILL" packet and give it a chance to clean
    // up after itself.
    if (this.isWaiting) {
      this.socket.destroy();
      // This will fire off a "close" event for the process which is used to delete this instance of an interpreter
    } else {
      // Write out the kill message
      this.socket.write(JSON.stringify({ type: "KILL" }));
      this.socket.destroy();
    }
    this.process.kill();
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
    this.msgQueue.addMessage([codeHash, codeObj]);
    if (!this.connStatus || this.isWaiting) {
      console.log("CLIENT: adding message to queue in runCode", codeObj);
      // this.msgQueue.addMessage([codeHash, codeObj]);
    } else {
      // If not busy, send off code object to server and return code hash
      console.log("CLIENT: Sending message directly in runCode", codeObj);
      this.sendMsg();
    }
    return codeHash;
  }

  /**
   * Run a string containing code and kill the language server once result is received.
   *
   * @param {string} data Instructions to be sent.
   * @return {string} SHA256 hash used to emit an event containing the server's response.
   * @memberof Interpreter
   */

  runAndKill(data) {
    let codeObj = { type: "RUNANDKILL", code: data };
    let codeHash = this.calcHash(data);
    // If the socket is not open yet or we are waiting for a message response,
    // append the new message to the message queue.
    if (!this.connStatus || this.isWaiting) {
      this.msgQueue.addMessage([codeHash, codeObj]);
    } else {
      // If not busy, send off code object to server and return code hash
      this.sendMsg();
    }
    return codeHash;
  }
}

module.exports.Interpreter = Interpreter;

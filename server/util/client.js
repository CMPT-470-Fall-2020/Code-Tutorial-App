const net = require("net");
const crypto = require("crypto");

class Queue {
  constructor() {
    // Queue containing all messages
    this.msgQueue = [];
    this.queueLen = 0;
  }

  isEmpty() {
    return this.queueLen == 0;
  }

  addMessage(msg) {
    this.msgQueue.push(msg);
    this.queueLen += 1;
  }

  getMessage() {
    if (this.queueLen > 0) {
      let msg = this.msgQueue.shift();
      this.queueLen -= 1;
      return msg;
    }
    return undefined;
  }
}

class Interpreter {
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
    // The current hash
    this.currentHash = undefined;
    // The socket used to make a connection
    this.socket = new net.Socket();
    this.retryAttempNum = 0;
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

  sendMsg() {
    if (!this.msgQueue.isEmpty()) {
      // Retrieve next message
      let [hash, msg] = this.msgQueue.getMessage();

      this.isWaiting = true;
      this.currentHash = hash;
      this.socket.write(JSON.stringify(msg));
    }
  }

  recv_data(data) {
    // Send out data
    this.emitter.emit(this.currentHash, data);
    console.log("received", data.toString("utf-8"));

    if (!this.msgQueue.isEmpty()) {
      let [hash, msg] = this.msgQueue.getMessage();
      this.isWaiting = true;
      this.currentHash = hash;
      this.socket.write(JSON.stringify(msg));
    }
  }

  calcHash(codeStr) {
    let currTime = Date.now().toString();
    let hashInputStr = currTime + this.interpName + codeStr;
    let uniqueHash = crypto
      .createHash("sha256")
      .update(hashInputStr)
      .digest("hex");
    return uniqueHash;
  }

  isLive() {
    return this.sockStatus;
  }

  kill() {
    this.socket.destroy();
  }

  runCode(data) {
    let codeObj = { type: "RUN", code: data };
    let codeHash = this.calcHash(data);
    // If the socket is not open yet or we are waiting for a message response,
    // append the new message to the message queue.
    if (!this.sockStatus || this.isWaiting) {
      this.msgQueue.addMessage([codeHash, codeObj]);
    } else {
      // If not busy, send off code object to server and return code hash
      this.isWaiting = true;
      this.currentHash = hash;
      this.socket.write(JSON.stringify(codeObj));
    }
    return codeHash;
  }
}

module.exports.Interpreter = Interpreter;

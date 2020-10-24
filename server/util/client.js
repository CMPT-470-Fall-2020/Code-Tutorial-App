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

    this.socket.connect(portNum, "127.0.0.1", () => {
      console.log("client on port: ", portNum, " connected!");
      this.sockStatus = true;
      if (!this.msgQueue.isEmpty()) {
        // Retrieve next message
        let [hash, msg] = this.msgQueue.getMessage();

        this.isWaiting = true;
        this.currentHash = hash;
        this.socket.write(JSON.stringify(msg));
      }
    });

    this.socket.on("data", (data) => {
      this.recv_data(data);
    });

    this.socket.on("close", function () {
      console.log("Connection closed");
    });
  }

  recv_data(data) {
    // Send out data
    this.emitter.emit(this.currentHash, data);

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

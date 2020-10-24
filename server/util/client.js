var net = require("net");

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
    this.msgQueue.push(data);
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
    // The socket used to make a connection
    this.socket = new net.Socket();

    this.socket.connect(portNum, "127.0.0.1", () => {
      console.log("client on port: ", portNum, " connected!");
      this.sockStatus = true;
      if (!this.msgQueue.isEmpty()) {
        this.isWaiting = true;
        msg = this.msgQueue.getMessage();
        this.socket.write(val);
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
    if (this.queueLen > 0) {
      let val = this.msgQueue.shift();
      this.queueLen -= 1;
      this.socket.write(val);
    }
  }
  isLive() {
    return this.sockStatus;
  }

  kill() {
    this.socket.destroy();
  }

  send(data) {
    this.msgQueue.push(data);
    this.queueLen += 1;
  }
}

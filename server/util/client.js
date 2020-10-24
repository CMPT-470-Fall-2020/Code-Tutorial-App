var net = require("net");

class Interpreter {
  constructor(portNum) {
    this.msgQueue = [];
    this.queueLen = 0;
    this.sockStatus = false;
    this.socket = new net.Socket();

    this.socket.connect(portNum, "127.0.0.1", () => {
      console.log("client on port: ", portNum, " connected!");
      this.sockStatus = true;
      if (this.queueLen > 0) {
        let val = this.msgQueue.shift();
        this.queueLen -= 1;
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

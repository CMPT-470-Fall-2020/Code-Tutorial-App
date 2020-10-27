const net = require("net");
const { spawn } = require("child_process");

class GenericServer {
  constructor(portNum, binName) {
    // The port we are using
    this.portNum = portNum;
    this.binName = binName;

    this.process;
    this.procIsLive = false;
    this.process = spawn(binName);

    this.process.stdout.on("data", (data) => {
      this.handleStdout(data);
    });
    this.process.stderr.on("data", (data) => {
      this.handleStderr(data);
    });

    this.process.on("error", () => {
      this.procIsLive = false;
      this.killServer();
    });

    this.process.on("close", () => {
      this.procIsLive = false;
      this.killServer;
    });

    this.procIsLive = true;
    this.socket;

    if (typeof this.process.pid != undefined) {

      this.server = new net.createServer();
      this.server.listen(this.portNum);

      this.server.on("connection", (socket) => {
        this.socket = socket;
        this.socket.on("data", (data) => {
          this.handleIncomingData(data);
        });
      });
    }
  }

  killServer() {
    if (this.procIsLive) {
      // TODO: Figure out what to do if the process could not be killed.
      this.process.kill();
    }
    process.exit(1);
  }

  handleStdout(data) {
    let respObject = { stdout: data, stderr: "" };
    this.socket.write(JSON.stringify(respObject));
  }
  handleStderr(data) {
    let respObject = { stdout: "", stderr: data };
    this.socket.send(JSON.stringify(respObject));
  }

  handleIncomingData(data) {
    let req = JSON.parse(data);
    if (req["type"] == "RUN") {
      if (this.procIsLive) {
        this.process.stdin.write(req["code"]);
      }
    }
  }
}

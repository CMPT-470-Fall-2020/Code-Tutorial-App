const net = require("net");
const { spawn } = require("child_process");

class GenericServer {
  constructor(portNum, binName) {
    // The port that the server is listening on.
    this.portNum = portNum;
    // The name of the binary which this server is running.
    this.binName = binName;
    // The socket used to recieve/send messages.
    this.socket;
    // The server instance.
    this.server;
    // Flag indicating if the process is still alive.
    this.procIsLive = false;
    this.shouldKill = false;
    // Handle to the process running the binary.
    this.process = spawn(binName);

    this.process.stdout.on("data", (data) => {
      this.handleStdout(data);
    });
    this.process.stderr.on("data", (data) => {
      this.handleStderr(data);
    });

    this.process.on("error", () => {
      this.procIsLive = false;
      this.socket.write(JSON.stringify({ type: "CONNECTION-ERROR" }));
      this.killServer();
    });

    this.process.on("close", () => {
      this.procIsLive = false;
      this.killServer;
    });

    // Check if the process has spawned. If it has not(its simply taking a long time) then
    // its PID should be undefined.
    if (typeof this.process.pid != undefined) {
      this.procIsLive = true;
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
    if (this.shouldKill) {
      this.killServer();
    }
  }
  handleStderr(data) {
    let respObject = { stdout: "", stderr: data };
    this.socket.send(JSON.stringify(respObject));
    if (this.shouldKill) {
      this.killServer();
    }
  }

  handleIncomingData(data) {
    let req = JSON.parse(data);

    if (!this.procIsLive) {
      this.socket.write(JSON.stringify({ type: "CONNECTION-ERROR" }));
      this.killServer();
    }

    if (req["type"] == "RUN") {
      this.process.stdin.write(req["code"]);
    } else if (req["type"] == "PING") {
      this.socket.write(JSON.stringify({ type: "CONNECTION-OK" }));
    } else if (req["type"] == "RUNANDKILL") {
      this.process.stdin.write(req["code"]);
      this.shouldKill = true;
    }
  }
}

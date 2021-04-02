const net = require("net");
const { spawn } = require("child_process");

class GenericServer {
  constructor(portNum, binName, binFlags) {
    // The port that the server is listening on.
    this.portNum = portNum;
    // The name of the binary which this server is running.
    this.binName = binName;
    // The flags(if any). Should be an array of one or more strings.
    this.binFlags = binFlags;
    // The socket used to recieve/send messages.
    this.socket;
    // Flag indicating if the process is still alive.
    this.procIsLive = false;
    this.shouldKill = false;
    this.currentTimestamp = undefined;
    this.commandOutput = { type: "SUCCESS", stdout: "", stderr: "" };

    // Start the server on the specified port an listen for connections
    this.server = new net.createServer();
    this.server.listen(this.portNum);

    this.server.on("connection", (socket) => {
      this.socket = socket;
      this.socket.on("data", (data) => {
        this.handleIncomingData(data);
      });
    });

    // Spawn child process
    this.process = spawn(binName, binFlags);

    // Add listeners to process events
    this.process.stdout.on("data", (data) => {
      this.handleStdout(data);
    });
    this.process.stderr.on("data", (data) => {
      this.handleStderr(data);
    });

    // At this point, the process should be live.
    // TODO: Find a better way to do this. At this point, this is just an approximation.
    this.procIsLive = true;

    this.process.on("error", () => {
      this.procIsLive = false;
      this.socket.write(JSON.stringify({ type: "CONNECTION-ERROR" }));
      this.killServer();
    });

    this.process.on("close", () => {
      this.procIsLive = false;
      this.killServer();
    });
  }

  // This method should be overridden by all clients
  // It should return a string containing a command which echoes a timestamp
  // This is done to recognize when a "quiet" command(like "cd" in bash) which
  // makes no output is done running. If this is not done, we have no way of detecting.
  // It should also set the timestampCommand variable to contain the string version
  // of the timestamp for comparison.
  createTimestampCommand() {
    let date = Date.now().toString();
    this.currentTimestamp = date;
    return "echo " + date;
  }

  handleIncomingData(data) {
    let req = JSON.parse(data);
    console.log("GENERAL SERVER: Got data", req);

    // If the connection dies, signal error and kill server
    if (!this.procIsLive) {
      this.socket.write(JSON.stringify({ type: "CONNECTION-ERROR" }));
      this.killServer();
    }

    if (req["type"] == "RUN") {
      this.process.stdin.write(req["code"] + "\n");
      this.timeStamp = this.createTimestampCommand();
      setTimeout(() => {
        this.process.stdin.write(this.timeStamp + "\n");
      }, 1000);
    } else if (req["type"] == "PING") {
      this.socket.write(JSON.stringify({ type: "CONNECTION-OK" }));
    } else if (req["type"] == "RUNANDKILL") {
      this.process.stdin.write(req["code"] + "\n");
      this.shouldKill = true;
    } else if (req["type"] == "KILL") {
      this.killServer();
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
    //let respObject = { type: "SUCCESS", stdout: data.toString(), stderr: "" };
    // If we get the current timestamp we are waiting for, the command has executed
    // and produced an output.
    if (data.toString().trim() === this.currentTimestamp) {
      console.log("GENERAL SERVER: Sending STDOUT data", this.commandOutput);
      this.socket.write(JSON.stringify(this.commandOutput));
      this.commandOutput = { type: "SUCCESS", stdout: "", stderr: "" };
    } else {
      console.log(
        "GENERAL SERVER: Appending stdout data to command output.",
        data.toString()
      );
      // Otherwise, we append the output.
      this.commandOutput["stdout"] =
        this.commandOutput["stdout"] + data.toString();
    }

    // If we have to, kill the server
    if (this.shouldKill) {
      this.killServer();
    }
  }

  handleStderr(data) {
    if (data.toString().trim() === this.currentTimestamp) {
      console.log("GENERAL SERVER: Sending STDOUT data", this.commandOutput);
      this.socket.write(JSON.stringify(this.commandOutput));
      this.commandOutput = { type: "SUCCESS", stdout: "", stderr: "" };
    } else {
      console.log(
        "GENERAL SERVER: Appending stdout data to command output.",
        data.toString()
      );
      // Otherwise, we append the output.
      this.commandOutput["stderr"] =
        this.commandOutput["stderr"] + data.toString();
    }

    if (this.shouldKill) {
      this.killServer();
    }
  }
}

module.exports.GenericServer = GenericServer;

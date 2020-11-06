const { spawn } = require("child_process");
var events = require("events");
const { Interpreter } = require("./client.js");

// Constants used to indicate the return status of function calls
const USERDNE = "USERDNE";
const USEREXISTS = "USEREXISTS";
const SUCCESS = "SUCCESS";
const INTERPDNE = "INTERPDNE";
const INTERPEXISTS = "INTERPEXISTS";
const LANGDNE = "LANGDNE"

class InterpreterManager {
  constructor(emitter) {
    this.instances = {};
    this.emitter = emitter;
    this.ports = [];

    // There are 65,536 TCP ports in total
    // IANA suggests that ports from 65353 - 49152 shoul be used for
    // ephemeral(i.e. temporary) connecetions.
    for (let i = 65535; i > 49152; i--) {
      this.ports.push(i);
    }
  }

  userExists(userName) {
    if (userName in this.instances) {
      return true;
    }
    return false;
  }

  interpInstanceExists(userName, instanceName) {
    if (this.userExists(userName) && instanceName in this.instances[userName]) {
      return true;
    }
    return false;
  }

  getInterp(userName, instanceName) {
    if (this.userExists(userName)) {
      if (this.interpInstanceExists(userName, instanceName)) {
        return this.instances[userName][instanceName];
      } else {
        return INTERPDNE;
      }
    }
    return USERDNE;
  }

  createUser(userName) {
    if (userName in this.instances) {
      return USEREXISTS;
    }

    this.instances[userName] = {};
    return SUCCESS;
  }

  createInterp(userName, interpName, interpType) {
    if (!this.userExists()) {
      this.createUser(userName);
    }

    if (this.interpInstanceExists(userName, interpName)) {
      console.log("MANAGER: Return an already existing interpreter");
      // console.log(this.instances[userName]);
      return this.instances[userName][interpName];
    }

    // Retrieve the port number for the server
    let portNum = this.ports.pop();
    let languageServer;

    switch (interpType.toLowerCase()) {
      case "python":
        console.log("trying python spawn", portNum)
        languageServer = spawn("python3", ["python-server.py", portNum]);
        break;
      case "bash":
        languageServer = spawn("./bash-server.js", [portNum]);
        break;
      case "zsh":
        languageServer = spawn("./zsh-server.js", [portNum]);
        break;
      case "julia":
        languageServer = spawn("./julia-server.js", [portNum]);
        break;
      case "ruby":
        // Ruby is not supported yet
        //languageServer = spawn("ruby", ["ruby-server.rb", portNum]);
        console.log("Ruby does not work yet")
        break;
      default:
        return LANGDNE;
    }

    // Set handlers for when the language server crashes
    languageServer.on("error", (code, signal) => {
      console.log(
        "MANAGER: Language server process died due to an error.",
        code,
        signal,
        "Returning port number and removing instance."
      );
      // Return the port number on exit
      this.ports.push(portNum);
      // Delete the interpreter instance
      delete this.instances[userName][interpName];
    });

    languageServer.on("close", (code, signal) => {
      console.log(
        "MANAGER: Language server process close",
        code,
        signal,
        "Returning port number and removing instance."
      );
      // Return the port number on exit
      this.ports.push(portNum);
      // Delete interpreter instance
      delete this.instances[userName][interpName];
    });

    console.log("MANAGER: Creating new interpreter instance.");
    let newInterp = new Interpreter(
      portNum,
      interpName,
      this.emitter,
      languageServer
    );

    console.log("MANAGER: Adding the new instance!");
    // Add the interpreter instance
    this.instances[userName][interpName] = newInterp;

    // Return the interpreter instance to caller to run code.
    return newInterp;
  }
}

module.exports = {
  InterpreterManager: InterpreterManager,
  USERDNE: USERDNE,
  USEREXISTS: USEREXISTS,
  SUCCESS: SUCCESS,
  INTERPDNE: INTERPDNE,
  INTERPEXISTS: INTERPEXISTS,
  LANGDNE: LANGDNE
};

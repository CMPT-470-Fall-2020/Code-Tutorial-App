const { spawn } = require("child_process");
var events = require("events");
const { Interpreter } = require("./client.js");

// Constants used to indicate the return status of function calls
const USERDNE = "USERDNE";
const USEREXISTS = "USEREXISTS";
const SUCCESS = "SUCCESS";
const INTERPDNE = "INTERPDNE";
const INTERPEXISTS = "INTERPEXISTS";

class InterpreterManager {
  constructor(emitter) {
    this.instances = {};
    this.emitter = emitter;
    this.ports = [];

    // There are 65,536 TCP ports in total
    // IANA suggests that ports from 65353 - 49152 shoul be used for ephemeral(i.e. temporary) connecetions.
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

    switch (interpType) {
      case "PYTHON":
        languageServer = spawn("python3", ["python-server.py", portNum]);
        break;
      case "RUBY":
        languageServer = spawn("ruby", ["ruby-server.rb", portNum]);
        break;
      case "BASH":
        // TODO: Finish client
        // languageServer = spawn("ruby", ["serve.rb", portNum]);
        console.log("got bash");
        break;
      case "ZSH":
        // TODO: Finish client
        // languageServer = spawn("ruby", ["serve.rb", portNum]);
        console.log("got zsh");
        break;
      default:
        console.log("Language does not exist");
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
    // Return the interpreter instance to the user to use it to run code.
    console.log("MANAGER: Returning interpreter instance to caller.");
    return newInterp;
  }
}

// let evEm = new events.EventEmitter();
// let man = new InterpreterManager(evEm);
// let interp = man.createInterp("name", "i1", "PYTHON");

// let hash = interp.runCode("print(4 + 4)");
// evEm.on(hash, (resp) => {
//   console.log(resp);
// });

// hash = interp.runCode("import math\nprint(math.log2(4+4))");
// evEm.on(hash, (resp) => {
//   console.log(resp);
// });

module.exports = {
  InterpreterManager: InterpreterManager,
  USERDNE: "USERDNE",
  USEREXISTS: "USEREXISTS",
  SUCCESS: "SUCCESS",
  INTERPDNE: "INTERPDNE",
  INTERPEXISTS: "INTERPEXISTS",
};

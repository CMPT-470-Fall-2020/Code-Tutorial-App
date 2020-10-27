const cp = require("child_process");
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
    // Ports from 0 - 1023 are well known so we do not use those.
    for (i = 1024; i < 65000; i++) {
      this.ports.push(i);
    }
  }

  userExists(userName) {
    if (username in this.instances) {
      return true;
    }
    return false;
  }

  interpInstanceExists(userName, instanceName) {
    if (this.userExists(userName) && instanceName in this.instances[username]) {
      return true;
    }
    return false;
  }

  getInterp(userName, instanceName) {
    if (this.userExists(userName)) {
      if (this.interpInstanceExists(userName, instanceName)) {
        return this.instances[username][instanceName];
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
      return this.instances[userName][interpName];
    }

    // Retrieve the port number for the server
    let portNum = this.ports.pop();
    let languageServer;

    switch (interpType) {
      case "PYTHON":
        languageServer = spawn("python3"[("serve.py", portNum)]);
        break;
      case "RUBY":
        languageServer = spawn("ruby"[("serve.rb", portNum)]);
        break;
      case "BASH":
        // TODO: Finish client
        languageServer = spawn("ruby"[("serve.rb", portNum)]);
        break;
      case "ZSH":
        // TODO: Finish client
        languageServer = spawn("ruby"[("serve.rb", portNum)]);
        break;
      default:
        console.log("Language does not exist");
    }

    let newInterp = Interpreter(portNum, interpName, emitter, languageServer);

    // Set handlers for when the language server crashes
    languageServer.on("error", (code, signal) => {
      // Return the port number on exit
      this.ports.push(portNum);
      // Delete the interpreter instance
      delete this.instances[userName][interpName];
    });

    languageServer.on("close", (code, signal) => {
      // Return the port number on exit
      this.ports.push(portNum);
      // Delete interpreter instance
      delete this.instances[userName][interpName];
    });
    // Add the interpreter instance
    this.instances[userName][interpName] = newInterp;
    // Return the interpreter instance to the user to use it to run code.
    return newInterp;
  }
}

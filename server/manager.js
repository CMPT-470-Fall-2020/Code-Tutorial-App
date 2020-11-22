const { spawn } = require("child_process");
var events = require("events");
const { Interpreter } = require("./client.js");

// Constants used to indicate the return status of function calls
const LANGDNE = "LANGDNE";

const BASH = "bash";
const ZSH = "zsh";
const PYTHON = "python";
const JULIA = "julia";

const PERMITTED_LANGUAGES = [BASH, ZSH, PYTHON, JULIA];

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

  createUser(userName) {
    if (userName in this.instances) {
      return false;
    }

    this.instances[userName] = {};
    return true;
  }

  removeUser(userName) {
    delete this.instances[userName];
  }

  isPermittedLanguage(lang) {
    if (PERMITTED_LANGUAGES.includes(lang.toLowerCase())) {
      return true;
    } else {
      return false;
    }
  }

  createInstance(userName, interpName, lang) {
    // Retrieve the port number for the server
    let portNum = this.ports.pop();

    let newInterp = new Interpreter(portNum, interpName, lang, this.emitter);

    // Add interpreter to instances
    this.instances[userName][interpName] = newInterp;
    return newInterp;
  }

  getInstance(userName, interpName, lang) {
    if (!this.isPermittedLanguage(lang)) {
      return LANGDNE;
    }

    // Create a new user if they do not exist
    if (!this.userExists(userName)) {
      this.createUser(userName);
    }

    if (this.interpInstanceExists(userName, interpName)) {
      console.log("MANAGER: return existing instance");
      return this.instances[userName][interpName];
    } else {
      console.log("MANAGER: return new instance");
      return this.createInstance(userName, interpName, lang);
    }
  }

  deleteInstance(userName, interpName) {
    delete this.instances[userName][interpName];
  }
}

module.exports = {
  InterpreterManager: InterpreterManager,
  LANGDNE: LANGDNE,
};

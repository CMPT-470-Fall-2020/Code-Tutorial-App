const { spawn } = require("child_process");
var events = require("events");
const { Interpreter } = require("./client.js");
const { DockerInstance } = require("./docker-instance");

// Constants used to indicate the return status of function calls
const USERDNE = "USERDNE";
const USEREXISTS = "USEREXISTS";
const SUCCESS = "SUCCESS";
const INTERPDNE = "INTERPDNE";
const INTERPEXISTS = "INTERPEXISTS";
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
      console.log("MANAGER: Creating user");
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
    let interpreterLang = undefined;

    if (PERMITTED_LANGUAGES.includes(interpType.toLowerCase())) {
      interpreterLang = interpType.toLowerCase();
    } else {
      return LANGDNE;
    }

    console.log("MANAGER: Creating new interpreter instance at port", portNum);
    let dockerInstance = new DockerInstance(interpreterLang, portNum);
    let newInterp = new Interpreter(
      portNum,
      interpName,
      this.emitter,
      dockerInstance
    );
    console.log("MANAGER: Creating new Docker Instance");

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
  LANGDNE: LANGDNE,
};

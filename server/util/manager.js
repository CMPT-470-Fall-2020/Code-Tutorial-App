const cp = require('child_process');

// Constants used to indicate the return status of function calls
const USERDNE = "USERDNE";
const USEREXISTS = "USEREXISTS";
const SUCCESS = "SUCCESS";
const INTERPDNE = "INTERPDNE";
const INTERPEXISTS = "INTERPEXISTS";

class InterpreterManager{
	constructor(){
		this.instances = {};
		this.ports = []

		// There are 65,536 TCP ports in total
		// Ports from 0 - 1023 are well known so we do not use those.
		for (i = 1024; i < 65000, i++){
			this.ports.push(i);
		}
	}
	
	userExists(userName){
		if (username in this.instances){
			return true;
		}
		return false;
	}

	interpInstanceExists(userName, instanceName){
		if (this.userExists(userName) && instanceName in this.instances[username]){
				return true;
		}
		return false;
	}
	
	getInterpInstance(userName, instanceName){
		if (this.userExists(userName)){
			if (this.interpInstanceExists(userName, instanceName)){
				return this.instances[username][instanceName];
			}else{
				return INTERPDNE;
			}
		}
		return USERDNE;
	}

	createUser(userName){
		if (userName in this.instances){
			return USEREXISTS;
		}

		this.instances[userName] = {};
		return SUCCESS;
	}
	
	createInterp(userName, interpName, interpType){
		if (!this.userExists()){
			this.createUser(userName);
		}

		if (this.interpInstanceExists(userName, interpName)){
			return INTERPEXISTS;
		}

		// Retrieve the port number for the server
		let portNum = this.ports.pop();
		let child; 

		switch(interpType){
				case "PYTHON":
					child = spawn("python3" ['serve.py', portNum])
				case "RUBY":
					child = spawn("ruby" ['serve.rb', portNum])
				default:
						console.log("Language does not exist")
		}
	  	child.on("exit", (code, signal) => {
	  		// Return the port number on exit
			this.ports.push(portNum);
	  	});
	}
}

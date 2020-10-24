const USERDNE = "USERDNE";
const USEREXISTS = "USEREXISTS";
const SUCCESS = "SUCCESS";
const INTERPDNE = "INTERPDNE";

class InterpreterManager{
	constructor(){
		this.instances = {};
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
	
	createInterp(userName, interpName){
		// Create an interpreter for a user
	}
}

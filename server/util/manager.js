const USERDNE = "USERDNE";
const USEREXISTS = "USEREXISTS";
const SUCCESS = "SUCCESS";
const INTERPDNE = "INTERPDNE";

class InterpreterManager{
	constructor(){
		this.instances = {};
	}
	
	getInterpInstance(username, instanceName){
		if (username in this.instances){
			if (instanceName in this.instances[username]){
				return this.instances[username][instanceName]
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

const BASH = "bash"
const ZSH = "zsh"
const PYTHON = "python"
const JULIA = "julia"

class DockerInstance{
	constructor(imageType){
		this.imgType = undefined;
		switch(imageType){
				case BASH:
					this.imgType = BASH;
					break
				case "zsh":
					this.imgType = ZSH;
					break;
				case "julia":
					this.imgType = JULIA;
					break;
				case "python":
					this.imgType = PYTHON;
					break;
				default:
					throw 'Language does not have a docker instance.';
		}
	}
	
	getType(){
		return this.imgType;
	}
}

module.exports = {
  DockerInstance: DockerInstance,
  lang: {
	BASH: BASH,
	PYTHON: PYTHON,
	ZSH: ZSH,
	JULIA: JULIA
  }
};


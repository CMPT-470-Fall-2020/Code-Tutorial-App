const Chance = require("chance");
const { exec } = require("child_process");
const chance = new Chance();
const DOCKER_NAME_POOL =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const BASH = "bash";
const ZSH = "zsh";
const PYTHON = "python";
const JULIA = "julia";

const PERMITTED_LANGUAGES = [BASH, ZSH, PYTHON, JULIA];

const BASE_IMAGES = {
  bash: "470-ubuntu-bash",
  zsh: "470-ubuntu-zsh",
  python: "470-ubuntu-python",
  julia: "470-ubuntu-julia",
};

class DockerInstance {
  constructor(imageLang, portNum) {
    this.imgType = PERMITTED_LANGUAGES.includes(imageLang.toLowerCase())
      ? imageLang.toLowerCase()
      : undefined;

    console.log("the image type is.", this.imgType);
    console.log("Base images", BASE_IMAGES);
    // TODO: Signal if the language does not exist
    this.portNum = portNum;
    this.baseImg = BASE_IMAGES[imageLang.toLowerCase()];
    this.container_name = chance.string({ pool: DOCKER_NAME_POOL });

    console.log(
      "Constructor finished. Container name will be",
      this.container_name
    );
  }

  startInstance() {
    // Generate a container random name
    const START_COMMAND = `docker run -p ${this.portNum}:5000 -d --name=${this.container_name} ${this.baseImg}`;

    console.log("DOCKER: About to execute", START_COMMAND);
    exec(START_COMMAND, (error, stdout, stderr) => {
      if (error) {
        // TODO: Figure out what to do if the language server cannot be started.
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        // TODO: Figure out what to do if the language server cannot be started.
        console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.log(this.baseImg);
    });
  }

  removeInstance() {
    // This command removes the container from the harddrive and frees up space
    const RM_COMMAND = `docker rm ${this.container_name}`;
    console.log("running", RM_COMMAND);
    exec(RM_COMMAND, (error, stdout, stderr) => {
      if (error) {
        // TODO: Figure out what to do if the language server cannot be started.
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        // TODO: Figure out what to do if the language server cannot be started.
        console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.log("finished RM command");
    });
  }
  stopInstance() {
    // This command will stop a container
    const STOP_COMMAND = `docker container stop ${this.container_name}`;

    console.log("running", STOP_COMMAND, "container name", this.container_name);
    exec(STOP_COMMAND, (error, stdout, stderr) => {
      if (error) {
        // TODO: Figure out what to do if the language server cannot be started.
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        // TODO: Figure out what to do if the language server cannot be started.
        console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.log("finished STOP command");
      this.removeInstance();
    });
  }

  isAlive() {}
}

module.exports = {
  DockerInstance: DockerInstance,
  lang: {
    BASH: BASH,
    PYTHON: PYTHON,
    ZSH: ZSH,
    JULIA: JULIA,
  },
};

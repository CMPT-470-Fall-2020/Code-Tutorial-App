const Chance = require("chance");
const Docker = require("dockerode");
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
    this.docker = new Docker();
    this.container_instance = undefined;

    console.log(
      "Constructor finished. Container name will be",
      this.container_name
    );
  }

  startInstance() {
    this.docker.createContainer(
      {
        Image: this.baseImg,
        name: this.container_name,
        HostConfig: {
          AutoRemove: true,
          PortBindings: {
            "5000/tcp": [{ HostIp: "", HostPort: `${this.portNum}` }],
          },
        },
      },
      (err, container) => {
        console.log("DOCKER: Starting the container");
        this.container_instance = container;
        console.log(
          "DOCKER: After setting container instance",
          this.container_instance
        );

        container.start((err, data) => {
          console.log("container started", err, data);
        });
      }
    );
  }

  stopInstance() {
    this.container_instance.stop((err, data) => {
      console.log("Instance stopped");
    });
  }

  // TODO implement check for container being alive
  isAlive() {}
}

let ex = new DockerInstance(BASH, 54322);
ex.startInstance();

module.exports = {
  DockerInstance: DockerInstance,
  lang: {
    BASH: BASH,
    PYTHON: PYTHON,
    ZSH: ZSH,
    JULIA: JULIA,
  },
};

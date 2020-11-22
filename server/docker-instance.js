const Chance = require("chance");
const Docker = require("dockerode");
const chance = new Chance();
const DOCKER_NAME_POOL =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const BASE_IMAGES = {
  bash: "470-ubuntu-bash",
  zsh: "470-ubuntu-zsh",
  python: "470-ubuntu-python",
  julia: "470-ubuntu-julia",
};

class DockerInstance {
  constructor(imageLang, portNum) {
    console.log("DOCKER: IMAGE AND PORT:", imageLang, portNum);
    this.imgType = imageLang;
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

  startInstance(callback) {
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
        console.log("DOCKER: After setting container instance");
        if (err) {
          // TODO: Use a constant to indicate a status and check the type of error.
          return 1;
        }
        container.start((err, data) => {
          console.log("container started", err, data);
          if (err) {
            return 1;
          }
          callback();
          return 0;
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

module.exports = {
  DockerInstance: DockerInstance,
};

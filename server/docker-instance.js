const Chance = require("chance");
const Docker = require("dockerode");
const SharedLog = require("./logging");
const logger = SharedLog.getInstance().logger;

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
    console.log(
      "DOCKER: Create new instance with image name and port number:",
      imageLang,
      portNum
    );
    this.imgType = imageLang;
    this.portNum = portNum;
    this.baseImg = BASE_IMAGES[imageLang.toLowerCase()];
    this.container_name = chance.string({ pool: DOCKER_NAME_POOL });
    this.docker = new Docker();
    this.container_instance = undefined;

    logger.trace(
      "DOCKER: Constructor finished. Container name will be",
      this.container_name
    );
  }

  startInstance(callback) {
    logger.trace("DOCKER: StartInstance called");
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
        if (err) {
          // TODO: Use a constant to indicate a status and check the type of error.
          throw err
          console.log("DOCKER: Container could not be created.", err.message);
          return 1;
        }

        logger.trace("DOCKER: Container created. Starting container...");
        this.container_instance = container;
        container.start((err, data) => {
          if (err) {
          throw err;
          logger.trace(
            "DOCKER: container started  error",
            err,
            "Calling callback"
          );

            return 1;
          }
          logger.trace(
            "DOCKER: container started without error",
            data,
            "Calling callback"
          );
          callback();
          return 0;
        });
      }
    );
  }

  stopInstance(callback) {
    this.container_instance.stop((err, data) => {
      if (err) {
        throw err
        console.log("Instance stopped with an error:", err);
      }
      console.log("Instance stopped succesfully");
      callback("Instance stopped succesfully")

    });
  }

  // TODO implement check for container being alive
  isAlive() {}
}

module.exports = {
  DockerInstance: DockerInstance,
};

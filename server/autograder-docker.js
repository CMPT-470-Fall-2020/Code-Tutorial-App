const Chance = require("chance");
const Docker = require("dockerode");
const SharedLog = require("./logging");
const { PassThrough } = require("stream");
const fs = require("fs");
const tar = require("tar-stream");
const logger = SharedLog.getInstance().logger;

const chance = new Chance();
const DOCKER_NAME_POOL =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

class AutograderDockerInstance {
  constructor(imageLang) {
    logger.info(
      "DOCKER: Create new instance with image name and port number:",
      imageLang
    );
    //this.imgType = imageLang;
    //this.baseImg = BASE_IMAGES[imageLang.toLowerCase()];
    this.container_name = chance.string({ pool: DOCKER_NAME_POOL });
    this.docker = new Docker();
    this.container_instance = undefined;

    logger.trace(
      "DOCKER: Constructor finished. Container name will be",
      this.container_name
    );
  }

  execInContainer(callback) {
    this.container_instance.exec(
      {
        Cmd: ["python3", "professorTest.py"],
        attachStdout: true,
        attachStderr: true,
        WorkingDir: "/home",
      },
      (err, exec) => {
        console.log("created exec command");
        if (err) {
          console.log("exec got an error");
          throw err;
        } else {
          console.log("Exec command is created.");
          exec.start({}, (err, stream) => {
            console.log("exec is starting");
            //console.log("stdout",process.stdout)
            let outputStdout = "";
            let logStream = new PassThrough();
            logStream.on("data", function (chunk) {
              outputStdout += chunk.toString("utf8");
              console.log("data 1", outputStdout);
              callback(outputStdout);
            });

            logStream.on("end", function () {
              console.log("output from exec command end", outputStdout);
            });
            logStream.on("finish", function () {
              console.log("output from exec command finish", outputStdout);
            });

            this.docker.modem.demuxStream(stream, logStream, process.stderr);
          });
        }
      }
    );
  }
  // Src: https://github.com/apocas/dockerode/issues/240
  // Even though the docker API can use "gzip", for some reason the
  // container cannot unzip it.
  sendArchiveToInstance(
    localFileName,
    instanceFileName,
    studentCode,
    responseCallback
  ) {
    let professorFile = fs.readFile(localFileName, "utf-8", (err, data) => {
      // Bind this to self variable so there is no name clash inside of callbacks.
      let self = this;
      console.log("err file", err);
      console.log("SENDARCHIVE:", data, "AND STUDENT CODE:", studentCode);

      let pack = tar.pack();
      pack.entry({ name: instanceFileName }, data);
      pack.entry({ name: "studentCode.py" }, studentCode);
      pack.finalize();

      var chunks = [];
      pack.on("data", function (chunk) {
        chunks.push(chunk);
      });
      pack.on("end", function () {
        var buffer = Buffer.concat(chunks);
        self.container_instance.putArchive(
          buffer,
          { path: "/home" },
          function (error, response) {
            if (error) {
              console.log("Error transporting file", error);
            } else {
              console.log("Finished transport. Exec command now.");

              self.execInContainer(responseCallback);
            }
          }
        );
      });
    });
  }

  startInstance(callback) {
    logger.trace("DOCKER: StartInstance called");
    this.docker.createContainer(
      {
        Image: "470-ubuntu-python-autograder",
        name: this.container_name,
        HostConfig: {
          AutoRemove: true,
        },
      },
      (err, container) => {
        if (err) {
          // TODO: Use a constant to indicate a status and check the type of error.
          logger.error("DOCKER: Container could not be created.", err.message);
          return 1;
        }

        logger.trace("DOCKER: Container created. Starting container...");
        this.container_instance = container;
        container.start((err, data) => {
          if (err) {
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

  stopInstance() {
    this.container_instance.stop((err, data) => {
      if (err) {
        logger.error("Instance stopped with an error:", err);
        return false;
      }
      logger.info("Instance stopped succesfully");
      return true;
    });
  }

  // TODO implement check for container being alive
  isAlive() {}
}

/*
let a = new AutograderDockerInstance("a", 44);
a.startInstance(() => {
  console.log("Instance Started!");
  a.sendArchiveToInstance("./profTest.py", "professorTest.py");
});
*/

module.exports = {
  AutoGraderInstance: AutograderDockerInstance,
};

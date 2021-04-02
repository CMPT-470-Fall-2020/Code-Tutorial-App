const Chance = require("chance");
const Docker = require("dockerode");
const SharedLog = require("../server_logging/logging");
const { PassThrough } = require("stream");
const fs = require("fs");
const tar = require("tar-stream");
const logger = SharedLog.getInstance().logger;

const chance = new Chance();
const DOCKER_NAME_POOL =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const BASE_IMAGES = {
  bash: "470-ubuntu-bash-autograder",
  zsh: "470-ubuntu-zsh-autograder",
  python: "470-ubuntu-python-autograder",
  julia: "470-ubuntu-julia-autograder",
};

const COMMANDS = {
  bash: ["bash", "professorTest.sh"],
  zsh: ["zsh", "professorTest.sh"],
  python: ["python3", "professorTest.py"],
  julia: ["julia", "professorTest.jl"],
};

class AutograderDockerInstance {
  constructor(lang) {
    this.lang = lang.toLowerCase();
    this.baseImg = BASE_IMAGES[this.lang];
    this.startCommand = COMMANDS[this.lang];
    this.container_name = chance.string({ pool: DOCKER_NAME_POOL });
    this.docker = new Docker(); // create new docker instance
    // This is set after the container is started and holds the instance to the containter.
    this.container_instance = undefined;
    this.pollId = undefined;
    // Store the output of the exec command's stdout and stderr.
    this.execStdout = "";
    this.execStderr = "";
    // Holds the callback function used send data back to client.
    this.respCallback = undefined;
    this.fileEnding = "";
    switch (this.lang) {
      case "julia":
        this.fileEnding = ".jl";
        break;
      case "python":
        this.fileEnding = ".py";
        break;
      case "zsh":
        this.fileEnding = ".sh";
        break;
      case "bash":
        this.fileEnding = ".sh";
        break;
      default:
        console.log("could not recognize name!");
        break;
    }

    console.log(this.fileEnding);
    logger.trace(
      "DOCKER: Constructor finished. Container name will be",
      this.container_name,
      this.lang,
      this.baseImg,
      this.startCommand
    );
  }

  execInContainer(callback) {
    this.container_instance
      .exec({
        Cmd: this.startCommand,
        attachStdout: true,
        attachStderr: true,
        WorkingDir: "/home",
      })
      .then((execObject) => {
        execObject.start({ hijack: true, stdin: false }, (err, stream) => {
          console.log("EXEC: Command is starting.");
          // Store the refernce to this class in a new variable so it does not get overwritten
          // by the events used to collect output.
          let self = this;
          let stdout = new PassThrough();
          let stderr = new PassThrough();

          // Set events for errors
          stderr.on("data", function (chunk) {
            self.execStderr += chunk.toString("utf8");
          });

          stdout.on("data", function (chunk) {
            self.execStdout += chunk.toString("utf8");
          });

          this.docker.modem.demuxStream(stream, stdout, stderr);

          this.pollId = setInterval(() => {
            execObject.inspect().then((resp) => {
              // If the process we are trying to execute has stopped running, we can send back
              // the response to the user.
              if (resp.Running === false) {
                console.log("EXEC: Instance Died x(");
                // If the object is dead, we want to send back the data and kill the container.
                self.respCallback(self.execStdout, self.execStderr);
                clearInterval(self.pollId);
                self.stopInstance();
              }
            });
          }, 3000);
        });
      })
      .catch((err) => {
        console.log("error when creating exec object", err);
      });
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
    // Store the callback used to send code back to the user.
    this.respCallback = responseCallback;

    let professorFile = fs.readFile(localFileName, "utf-8", (err, data) => {
      // Bind this to self variable so there is no name clash inside of callbacks.
      let self = this;
      console.log("err file", err);
      console.log(
        "SENDARCHIVE TEACHER CODE:\n",
        data,
        "AND STUDENT CODE:\n",
        studentCode,
        "end\n"
      );

      // Create a new tarfile
      let pack = tar.pack();
      pack.entry({ name: "professorTest" + this.fileEnding }, data);
      // TODO: Set file ending based on the type of file(.py, .sh, .zsh....)
      pack.entry({ name: "studentCode" + this.fileEnding }, studentCode);
      pack.finalize();

      var tarFileChunks = [];
      // The tarfile is a stream of data.
      // Each time a new chunk of data is created, we append it to the pack
      pack.on("data", function (chunk) {
        tarFileChunks.push(chunk);
      });
      pack.on("end", function () {
        var buffer = Buffer.concat(tarFileChunks);
        self.container_instance
          .putArchive(buffer, { path: "/home" })
          .then(() => {
            console.log("Success transporting file");
            self.execInContainer(responseCallback);
          })
          .catch((err) => {
            console.log("Error transporting file");
          });
      });
    });
  }

  startInstance(callback) {
    logger.trace("DOCKER: StartInstance called");
    this.docker.createContainer(
      {
        Image: this.baseImg,
        name: this.container_name,
        HostConfig: {
          AutoRemove: true,
        },
      },
      (err, container) => {
        if (err) {
          // TODO: Use a constant to indicate a status and check the type of error.
          console.log("DOCKER: Container could not be created.", err.message);
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
        console.log("Instance stopped with an error:", err);
      }
      console.log("Instance stopped succesfully");
    });
  }
}

module.exports = {
  AutoGraderInstance: AutograderDockerInstance,
};

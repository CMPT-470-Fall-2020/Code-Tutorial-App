const log4js = require("log4js");

// Source: https://gist.github.com/ericwastaken/11d0230f4f7dd57ef4907cd6250d985f

let SharedLog = (function () {
  // Instance stores a reference to the Singleton
  let _sharedLog;
  let _logger;

  // Initialize logger and return a single instance
  function init() {
    // We don't have a shared log instance yet, so let's create it and store it
    _sharedLog = this;

    // Configure the logger
    log4js.configure({
      appenders: {
        "code-exec": {
          type: "file",
          filename: "./server-logs/code-exec.log",
          maxLogSize: 2048,
        },
      },
      categories: { default: { appenders: ["code-exec"], level: "debug" } },
    });
    // Create an instance as configured
    _logger = log4js.getLogger("code-exec");

    return {
      logger: _logger,
    };
  }

  return {
    // Returns an instance or initialize a new one if it does not exist
    getInstance: function () {
      if (!_sharedLog) {
        _sharedLog = init();
      }
      return _sharedLog;
    },
  };
})();

module.exports = SharedLog;

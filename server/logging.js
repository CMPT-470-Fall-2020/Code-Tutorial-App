const log4js = require("log4js");
log4js.configure({
  appenders: { 'code-exec': { type: "file", filename: "./server-logs/code-exec.log", maxLogSize: 2048 } },
  categories: { default: { appenders: ["code-exec"], level: "debug" } }
});
 
module.exports = log4js.getLogger("code-exec");

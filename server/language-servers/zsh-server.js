#!/usr/bin/node

const { GenericServer } = require("./generic_server");

//console.log(process.argv[2])
class ZshServer extends GenericServer {
    constructor() {
        super(process.argv[2], "/usr/bin/zsh", []);
    }

    createTimestampCommand() {
        let date = Date.now().toString();
        this.currentTimestamp = date;
        return "echo " + date;
    }
}

var server = new ZshServer();

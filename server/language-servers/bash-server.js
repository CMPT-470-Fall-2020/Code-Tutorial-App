#!/usr/bin/node

const { GenericServer } = require("./generic_server");

//console.log(process.argv[2])
class BashServer extends GenericServer {
    constructor() {
        super(process.argv[2], "/usr/bin/bash", []);
    }

    createTimestampCommand() {
        let date = Date.now().toString();
        this.currentTimestamp = date;
        return "echo " + date;
    }
}

var server = new BashServer();

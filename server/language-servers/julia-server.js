#!/usr/bin/node

const { GenericServer } = require("./generic_server");

//console.log(process.argv[2])
class JuliaServer extends GenericServer {
    constructor() {
        super(process.argv[2], "/usr/bin/julia", ["-i", "-q"]);
    }

    createTimestampCommand() {
        let date = Date.now().toString();
        this.currentTimestamp = date;
        return "println(" + date + ")";
    }
}

var server = new JuliaServer();

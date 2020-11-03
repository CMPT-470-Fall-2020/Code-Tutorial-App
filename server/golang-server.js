#!/usr/bin/node

const { GenericServer } = require("./generic_server");
const { exec } = require("child_process");
var yaegi_path = undefined;


console.log("Finding yaegi");
exec("which yaegi", (error, stdout, stderr) => {
    // If we get an error or output to stderr, we are kind of fucked.
    // TODO: Figure out how to unfuck this if it happens.
    if (error) {
        console.log(`Error in running the process: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`Could not run which. Exit with error: ${stderr}`);
        return;
    }
    console.log("Stdout is", stdout)
    yaegi_path = stdout;
});


console.log("Finished finding yaegi!", yaegi_path);
class GolangServer extends GenericServer {
    constructor() {
        super(process.argv[2], yaegi_path, []);
    }

    createTimestampCommand() {
        let date = Date.now().toString();
        this.currentTimestamp = date;
        return "println(" + date + ")";
    }
}

var server = new GolangServer();

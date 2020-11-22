const { EventEmitter } = require("events");
const { InterpreterManager } = require("./manager");

let ev = new EventEmitter();
let man = new InterpreterManager(ev);

let interp = man.getInstance("uname", "test", "bash");
let hash = interp.runCode("echo 'Hello world'");
ev.on(hash, (data) => {
  console.log("Got a response!", data);
});

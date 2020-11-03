const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const events = require("events");
const interpManager = require("./manager.js");

var app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
const port = process.env.PORT || 4000;

var ev = new events.EventEmitter();
var interpreterManager = new interpManager.InterpreterManager(ev);

app.post("/run", (req, res) => {
  console.log("SERVER: hit a POST /run route with request body", req.body);
  let uname = req.body.uname;
  let iname = req.body.iname;
  let code = req.body.code;
  let lang = req.body.lang;
  let currInstance = interpreterManager.createInterp(uname, iname, lang);
  // The language the user requested does not exist. Send out an error
  if (currInstance == interpManager.LANGDNE) {
    res.json({ message: "Language requested does not exist" })
  } else {
    let hash = currInstance.runCode(code);
    ev.on(hash, (codeResp) => {
      console.log(
        "SERVER: sending response from language servers back to client:",
        codeResp
      );
      res.json({ message: codeResp });
    });
  }
});

app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});

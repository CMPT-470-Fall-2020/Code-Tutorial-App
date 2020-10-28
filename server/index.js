const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const events = require("events");
// const interpManager = require("./util/manager.js");
const interpManager = require("./manager.js");

var app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
const port = process.env.PORT || 4000;

var ev = new events.EventEmitter();
var interpreterManager = new interpManager.InterpreterManager(ev);

/* THIS IS AN EXAMPLE OF HOW OUR FILES WILL BE SERVED WHEN WE UPLOAD TO GCP
app.use(express.static(path.join(__dirname, "..","client", "build")));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "..","client", "build", "index.html"))
})
*/

app.get("/", (req, res) => {
  res.json({
    message: 'Hello World from the backend server on the "/" route!',
  });
});

app.post("/run", (req, res) => {
  console.log("SERVER: hit a POST /run route with request body", req.body);
  let uname = req.body.uname;
  let iname = req.body.iname;
  let code = req.body.code;
  let lang = req.body.lang;
  let currInstance = interpreterManager.createInterp(uname, iname, lang);
  let hash = currInstance.runCode(code);
  ev.on(hash, (codeResp) => {
    console.log(
      "SERVER: sending response from language servers back to client:",
      codeResp
    );
    res.json({ message: codeResp });
  });
});

app.get("/hello", (req, res) => {
  res.json({
    message: 'Hello World from the backend server on the "/hello" route!',
  });
});

app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});

const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
var app = express();
const port = process.env.PORT || 4000;

// Database code
require('dotenv').config();
app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;

mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true});
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
});

/* THIS IS AN EXAMPLE OF HOW OUR FILES WILL BE SERVED WHEN WE UPLOAD TO GCP
app.use(express.static(path.join(__dirname, "..","client", "build")));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "..","client", "build", "index.html"))
})
*/

app.get('/', (req, res) => {
  res.json({message: 'Hello World from the backend server on the "/" route!'})
})

app.get('/hello', (req, res) => {
  res.json({message: 'Hello World from the backend server on the "/hello" route!'})
})

app.listen(port, ()=> {
	console.log(`Backend server listening on port ${port}`)
})

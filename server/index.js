const path = require('path')
const express = require('express');
var app = express();
const port = process.env.PORT || 4000;

// THIS IS AN EXAMPLE OF HOW OUR FILES WILL BE SERVED WHEN WE UPLOAD TO GCP
// app.use(express.static(path.join(__dirname, "..","client", "build")));

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, "..","client", "build", "index.html"))
// })



/* Temp routing code */
// const dashboardRouter = require('./routes/dashboard');
app.get('/dashboard', (req, res) => {
  res.json([{id: 1, name: 'CMPT 470'}, {id: 2, name: 'CMPT 471'}])
})

app.get('/', (req, res) => {
  res.json({message: 'Hello World from the backend server on the \"/\" route!'})
})

app.get('/coursesPage', (req, res) => {
  res.json([{id: 1, title: 'Assignment 1 clarification'}, {id: 2, title: 'Exam coverage'}])
})

app.get('/coursesPage/tutorials', (req, res) => {
  res.json([{id: 1, title: 'Tutorial 1'}, {id: 2, title: 'Tutorial 2'}])
})

app.listen(port, ()=> {
	console.log(`Backend server listening on port ${port}`)
})

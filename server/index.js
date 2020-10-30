const path = require('path')
const express = require('express');
var app = express();
const port = process.env.PORT || 4000;

// THIS IS AN EXAMPLE OF HOW OUR FILES WILL BE SERVED WHEN WE UPLOAD TO GCP
// app.use(express.static(path.join(__dirname, "..","client", "build")));

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, "..","client", "build", "index.html"))
// })

// TODO: need to route to ./routes
// TODO: Needs courses from database, add another argument for userid
app.get('/dashboard', (req, res) => {
  res.json([{id: 1, name: 'CMPT 470', description: 'Web-based Information Systems'}, 
  {id: 2, name: 'CMPT 383', description: 'Comparative Programming Languages'}])
})

app.get('/', (req, res) => {
  res.json({message: 'Hello World from the backend server on the \"/\" route!'})
})

app.listen(port, ()=> {
	console.log(`Backend server listening on port ${port}`)
})

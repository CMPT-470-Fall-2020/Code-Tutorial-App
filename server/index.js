CLUSTER_URI = "mongodb+srv://470_Project:<470_Project>@470project.c1pdi.mongodb.net/<dbname>?retryWrites=true&w=majority";
const path = require('path')
const express = require('express');
var app = express();
const port = process.env.PORT || 4000;

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

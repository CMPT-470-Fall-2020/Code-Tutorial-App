const express = require('express');
var app = express();
const port = 3001;

app.get('/', (req, res) => {
  res.send('Hello World from the backend server!')
})

app.listen(port, ()=> {
	console.log(`Backend server listening on port ${port}`)
})

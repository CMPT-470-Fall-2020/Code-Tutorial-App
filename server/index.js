const express = require('express');
var app = express();
const port = 4000;

app.get('/hello', (req, res) => {
  res.json({message: 'Hello World from the backend server!'})
})

app.listen(port, ()=> {
	console.log(`Backend server listening on port ${port}`)
})

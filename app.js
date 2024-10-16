const express = require('express')
const app = express()

console.log("Starting server...");  

app.get('/', (req, res) => {
  res.send('HELLO HELLO HELLO')
})

app.listen(3000)

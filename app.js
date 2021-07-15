const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('<h1 style="color : blue;"> MasterOfNotas Back-End! <\h1>')
})

app.listen(port, () => {
  require('./db-index')
  console.log('Ouvindo na porta' + port)
})
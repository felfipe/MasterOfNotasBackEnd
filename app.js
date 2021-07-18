const express = require('express')
require("dotenv-safe").config()
const app = express()
const cors = require('cors')
const port = 3000


const Aluno = require('./models/aluno.js')
const { query } = require('express')
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send('<h1 style="color : blue;"> MasterOfNotas Back-End! <\h1>')
})


require('./routes/auth')(app)
require('./routes/signup')(app)



app.listen(port, () => {
  require('./db-index')
  console.log('Ouvindo na porta' + port)
})
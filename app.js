const express = require('express')
require("dotenv-safe").config()
const app = express()
const cors = require('cors')
const port = 3000

const jwt = require('jsonwebtoken')
const Aluno = require('./models/aluno.js')
const { query } = require('express')
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send('<h1 style="color : blue;"> MasterOfNotas Back-End! <\h1>')
})



app.post('/auth', async (req, res) => {
  user = req.body.username
  passwd = req.body.password
  if (user == null || passwd == null) {
    res.status(500).json({ message: "Bad Requirement!" })
    return
  }
  const query_response = await Aluno.findOne({ where: { login: user, password: passwd } })

  if (query_response == null)
    res.status(500).json({ message: "Login Inválido!" })
  else {
    const id = query_response.id;
    const token = jwt.sign({ id }, process.env.SECRET, {
      expiresIn: 1200 // 20 min
    })
    res.json({ auth: true, token: token, username: query_response.name, tipoUsuario: query_response.tipoUsuario })
  }
})


app.listen(port, () => {
  require('./db-index')
  console.log('Ouvindo na porta' + port)
})
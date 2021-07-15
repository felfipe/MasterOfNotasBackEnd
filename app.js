const express = require('express')
require("dotenv-safe").config()
const app = express()
const port = 3000

const jwt = require('jsonwebtoken')
const Aluno = require('./models/aluno.js')
app.use(express.json())

app.get('/', (req, res) => {
  res.send('<h1 style="color : blue;"> MasterOfNotas Back-End! <\h1>')
})



app.post('/auth', async (req, res) => {
  user = req.body.username
  passwd = req.body.password
  const query_response = await Aluno.findOne({where: {login: user, password: passwd} })

  if(query_response == null)
    res.status(500).json({message: "Login Inválido!"})
  else{
      const id = query_response.id;
      const token = jwt.sign({id}, process.env.SECRET, {
        expiresIn: 1200 // 20 min
      })
      res.json({auth: true, token: token, username: query_response.name})
  }
})


app.listen(port, () => {
  require('./db-index')
  console.log('Ouvindo na porta' + port)
})
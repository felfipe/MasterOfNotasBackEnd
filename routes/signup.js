const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Usuario = require("../models/usuario")

const minute = 60

module.exports = function (app) {
  app.post('/signup', async (req, res) => {
    const { senha, nome, tipo, email } = req.body

    if (!email || !senha || !nome || !tipo) {
      res.status(400).json({ message: "bad request" })
      return
    }

    if (nome == "" || (tipo != "PROFESSOR" && tipo != "ALUNO")) {
      res.status(400).json({ message: "bad request: empty name ou invalid type" })
      return
    }

    if (!email.includes('@') || !email.includes('.com')) {
      res.status(400).json({ message: "bad request: invalid email" })
      return
    }

    if (senha.length < 6) {
      res.status(400).json({ message: "bad request: short password" })
      return
    }

    const emailEmUso = await Usuario.findOne({ where: { email } })
    if (emailEmUso) {
      res.status(409).json({ message: "user already exists" })
      return
    }

    const salt = await bcrypt.genSalt()
    const hash = await bcrypt.hash(senha, salt)

    const usuario = await Usuario.create({
      email,
      senha: hash,
      nome,
      tipo: (tipo == "PROFESSOR") ? 'P' : 'A'
    }).catch(err => {
      res.status(500).json({ message: `internal server error: ${err}` })
    })

    if (usuario) {
      const { id } = usuario
      const token = jwt.sign({ id }, process.env.SECRET, { expiresIn: 60 * minute })

      res.json({ auth: true, token: token, nome, tipo })
    }
  })
}
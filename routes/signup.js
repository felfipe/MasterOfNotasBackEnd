const Usuario = require("../models/usuario")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const minute = 60

module.exports = function (app) {
  app.post('/signup', async (req, res) => {
    const { password, name: username, userType, email } = req.body

    if (!email || !password || !username || !userType) {
      res.status(400).json({ message: "bad request" })
      return
    }

    if (username == "" || (userType != "PROFESSOR" && userType != "ALUNO")) {
      res.status(400).json({ message: "bad request: empty name ou invalid type" })
      return
    }

    if (!email.includes('@') || !email.includes('.com')) {
      res.status(400).json({ message: "bad request: invalid email" })
      return
    }

    if (password.length < 6) {
      res.status(400).json({ message: "bad request: short password" })
      return
    }

    const emailInUse = await Usuario.findOne({ where: { email } })
    if (emailInUse) {
      res.status(409).json({ message: "conflict: user already exists" })
      return
    }

    const salt = await bcrypt.genSalt()
    const hash = await bcrypt.hash(password, salt)

    const usuario = await Usuario.create({
      email,
      senha: hash,
      nome: username,
      tipoUsuario: (userType == "PROFESSOR") ? 'P' : 'A'
    }).catch(err => {
      res.status(500).json({ message: `internal server error: ${err}` })
    })

    if (usuario) {
      const { id } = usuario
      const token = jwt.sign({ id }, process.env.SECRET, { expiresIn: 60 * minute })

      res.json({ auth: true, token: token, name: username, userType: userType })
    }
  })
}
const Usuario = require("../models/usuario")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const minute = 60

module.exports = function (app) {
  app.post('/auth', async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(500).json({ message: "Bad Requirement!" })
      return
    }

    const usuario = await Usuario.findOne({ where: { email } })


    if (!usuario)
      res.status(500).json({ message: "Login Inválido!" })
    else {
      verifyPassword = await bcrypt.compare(password, usuario.senha)
      if (!verifyPassword) {
        res.status(500).json({ message: "Login Inválido!" })
        return
      }
      const { id } = usuario;
      const token = jwt.sign({ id }, process.env.SECRET, { expiresIn: 20 * minute })

      res.json({
        auth: true,
        token: token,
        name: usuario.nome,
        userType: (usuario.tipoUsuario == 'P') ? "PROFESSOR" : "ALUNO"
      })
    }
  })
}
const Usuario = require("../models/usuario")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const minute = 60

module.exports = function (app) {
  app.post('/auth', async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(400).json({ message: "bad resquest" })
      return
    }

    const usuario = await Usuario.findOne({ where: { email } })


    if (!usuario)
      res.status(401).json({ message: "invalid login" })
    else {
      verifyPassword = await bcrypt.compare(password, usuario.senha)
      if (!verifyPassword) {
        res.status(401).json({ message: "invalid login" })
        return
      }
      const { id } = usuario;
      const token = jwt.sign({ id }, process.env.SECRET, { expiresIn: 60 * minute })

      res.json({
        auth: true,
        token: token,
        name: usuario.nome,
        userType: (usuario.tipoUsuario == 'P') ? "PROFESSOR" : "ALUNO"
      })
    }
  })
}
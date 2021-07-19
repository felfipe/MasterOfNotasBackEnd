const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Usuario = require("../models/usuario")

const minuto = 60

module.exports = function (app) {
  app.post('/auth', async (req, res) => {
    const { email, senha } = req.body

    if (!email || !senha) {
      res.status(400).json({ message: "bad resquest" })
      return
    }

    const usuario = await Usuario.findOne({ where: { email } })


    if (!usuario)
      res.status(401).json({ message: "invalid login" })
    else {
      compararSenhas = await bcrypt.compare(senha, usuario.senha)
      if (!compararSenhas) {
        res.status(401).json({ message: "invalid login" })
        return
      }
      const { id } = usuario;
      const token = jwt.sign({ id }, process.env.SECRET, { expiresIn: 60 * minuto })

      res.json({
        auth: true,
        token,
        nome: usuario.nome,
        tipo: (usuario.tipo == 'P') ? "PROFESSOR" : "ALUNO"
      })
    }
  })
}
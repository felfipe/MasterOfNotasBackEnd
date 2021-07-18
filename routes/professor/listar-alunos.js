const Usuario = require("../../models/usuario")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const minute = 60

module.exports = function (app) {
  app.get('/listarAlunos', async (req, res) => {
    try {
      const { accesstoken: token } = req.headers
      const decodeToken = jwt.verify(token, process.env.SECRET)
      const usuario = await Usuario.findOne({ where: { id: decodeToken.id, tipoUsuario: 'P' } })
      if (!usuario) {
        res.status(500).json({ message: "Access Danied!" })
        return
      }
    } catch (error) {
      res.status(500).json({ message: "Access Danied!" })
      return
    }

    const alunos = await Usuario.findAll({ where: { tipoUsuario: 'A' } })

    const nomesAlunos = alunos.map(aluno => ({ name: aluno.nome, email: aluno.email }))

    res.json(nomesAlunos)
  })
}
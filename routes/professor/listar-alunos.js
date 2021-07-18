const Usuario = require("../../models/usuario")
const auth = require('../auth')

module.exports = function (app) {
  app.get('/listarAlunos', async (req, res) => {
    usuario = await auth(req, res)
    if(!usuario) return

    const alunos = await Usuario.findAll({ where: { tipoUsuario: 'A' } })

    const nomesAlunos = alunos.map(aluno => ({ name: aluno.nome, email: aluno.email }))

    res.json(nomesAlunos)
  })
}
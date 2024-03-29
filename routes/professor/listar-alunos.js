const auth = require('../auth')
const Usuario = require("../../models/usuario")

module.exports = function (app) {
  app.get('/listarAlunos', async (req, res) => {
    const professor = await auth(req, res)

    if (!professor) return

    if (professor.tipo !== 'P') {
      res.status(401).json({ message: "access danied" })
      return
    }

    const alunos = await Usuario.findAll({ where: { tipo: 'A' } })

    const nomesAlunos = alunos.map(aluno => ({
      id: aluno.id,
      name: aluno.nome,
      email: aluno.email
    }))

    res.json(nomesAlunos)
  })
}
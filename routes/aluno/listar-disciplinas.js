const auth = require('../auth')
const AlunoDisciplina = require("../../models/aluno-disciplina")

module.exports = function (app) {
  app.get('/listarDisciplinasMatriculadas', async (req, res) => {
    const aluno = await auth(req, res)

    if (!aluno) return

    if (aluno.tipoUsuario !== 'A') {
      res.status(401).json({ message: "access danied" })
      return
    }

    const disciplinas = await AlunoDisciplina.findAll({
      where: {
        alunoId: aluno.id
      },
      include: [{
        association: 'disciplina',
        include: ['professor']
      }]
    })

    const alunoDisciplinas = disciplinas.map(dd => ({
      id: dd.disciplinaId,
      name: dd.disciplina.nome,
      professor: dd.disciplina.professor.nome
    }))

    res.json(alunoDisciplinas)
  })
}
const auth = require('../auth')
const Questionario = require("../../models/questionario")

module.exports = function (app) {
  app.get('/listarEnquetesDisponiveis', async (req, res) => {
    const aluno = await auth(req, res)

    if (!aluno) return

    if (aluno.tipo !== 'A') {
      res.status(401).json({ message: "access danied" })
      return
    }

    const questionarios = await Questionario.findAll({
      where: {
        alunoId: aluno.id
      },
      include: [{
        association: 'enquete',
        where: { ativo: true },
        include: [{
          association: 'disciplina',
          include: ['professor']
        }]
      }]
    })

    const enquetesDoAluno = questionarios.map(qq => ({
      enqueteId: qq.enquete.id,
      nome: qq.enquete.nome,
      disciplina: {
        disciplinaId: qq.enquete.disciplinaId,
        nome: qq.enquete.disciplina.nome,
        sigla: qq.enquete.disciplina.sigla
      },
      professor: qq.enquete.disciplina.professor.nome
    }))

    res.json(enquetesDoAluno)
  })
}
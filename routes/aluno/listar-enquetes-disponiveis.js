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
        include: [{
          association: 'disciplina',
          include: ['professor']
        }]
      }]
    })
    const result = questionarios.map(questionario => ({
        enqueteId: questionario.enquete.id,
        nome: questionario.enquete.nome,
        disciplina: {
          disciplinaId: questionario.enquete.disciplinaId,
          nome: questionario.enquete.disciplina.nome,
          sigla: questionario.enquete.disciplina.sigla
        },
        professor: questionario.enquete.disciplina.professor.nome,
        respondido: questionario.respondido,
        nota: questionario.nota,
        ativo: questionario.enquete.ativo
      }))
    res.json(result)
  })
}
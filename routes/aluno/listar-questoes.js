const auth = require('../auth')

const Questao = require("../../models/questao")
const Questionario = require('../../models/questionario')

module.exports = function (app) {
  app.get('/listarQuestoes', async (req, res) => {
    const aluno = await auth(req, res)

    if (!aluno) return

    if (aluno.tipo !== 'A') {
      res.status(401).json({ message: "access danied" })
      return
    }

    const { enqueteId } = req.query
    if (!enqueteId) {
      res.status(400).json({ message: "bad request" })
      return
    }

    const questionario = await Questionario.findOne({
      where: {
        alunoId: aluno.id,
        enqueteId
      }, include: [{
        association: 'enquete',
        where: { ativo: true }
      }]
    })
    if (!questionario) {
      res.status(401).json({ message: "access danied" })
      return
    }

    const questoes = await Questao.findAll({ where: { id: questionario.questoesId }, include: ['alternativas'] })

    const questoesAluno = questoes.map(questao => ({
      questaoId: questao.id,
      enunciado: questao.enunciado,
      alternativas: questao.alternativas.map(alt => ({
        alternativaId: alt.id,
        enunciado: alt.enunciado,
      }))
    }))

    res.json(questoesAluno)
  })
}
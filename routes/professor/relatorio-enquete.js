const auth = require('../auth')
const Enquete = require("../../models/enquete")
const Questionario = require('../../models/questionario')
const Resposta = require('../../models/resposta')
const Alternativa = require('../../models/alternativa')

module.exports = function (app) {
  app.get('/gerarRelatorioEnquete', async (req, res) => {
    const professor = await auth(req, res)

    if (!professor) return

    if (professor.tipo !== 'P') {
      res.status(401).json({ message: "access danied" })
      return
    }

    const { enqueteId } = req.query

    const enquete = await Enquete.findOne({
      where: {
        id: enqueteId
      },
      include: {
        association: 'disciplina',
        where: { professorId: professor.id }
      }
    })

    if (!enquete) { res.status(401).json({ message: "access danied" }) }

    const questionario = await Questionario.findAll({
      where: { enqueteId },
      include: ['aluno']
    })

    const respostas = await Resposta.findAll({
      include: [{
        association: 'questao', where: { enqueteId }
      }]
    })

    const alternativas = await Alternativa.findAll({
      where: { alternativaCorreta: true },
      include: [{
        association: 'questao', where: { enqueteId }
      }]
    })

    const alunos = new Map()

    questionario.forEach(quest => {
      alunos[quest.aluno.nome] = 0
      const respostasAluno = respostas.filter(resp => +resp.alunoId === +quest.alunoId)
      respostasAluno.forEach(resp => {
        if (alternativas.find(alt => alt.questaoId === resp.questaoId && alt.id === resp.respostaId)) alunos[quest.aluno.nome]++
      })
    })

    for (const nomeAluno in alunos)
      alunos[nomeAluno] = 10 * (alunos[nomeAluno] / enquete.quantidade)

    res.json(alunos)
  })
}
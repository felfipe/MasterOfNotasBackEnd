const auth = require('../auth')
const sequelize = require('../../db-index')

const Enquete = require('../../models/enquete')
const Resposta = require('../../models/resposta')
const Alternativa = require('../../models/alternativa')

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

module.exports = function (app) {
  app.post('/responderEnquete', async (req, res) => {
    const aluno = await auth(req, res)

    if (!aluno) return

    if (aluno.tipo !== 'A') {
      res.status(401).json({ message: "access danied" })
      return
    }

    const { enqueteId, respostas } = req.body
    if (!enqueteId || !respostas) {
      res.status(400).json({ message: "bad request" })
      return
    }

    const alternativas = await Alternativa.findAll({ include: [{ association: 'questao', where: { enqueteId } }] })

    const enquete = await Enquete.findByPk(enqueteId, { include: ['disciplina'] })
    if (!enquete || !enquete.ativo) {
      res.status(401).json({ message: "access danied" })
      return
    }

    let valido = true
    respostas.forEach(resposta => {
      const { questaoId, respostaId } = resposta
      const validarResposta = alternativas.find(alt => alt.id === respostaId && alt.questaoId === questaoId)
      if (!validarResposta) valido = false
    })

    if (!valido) {
      res.status(400).json({ message: 'bad request: invalid answer' })
      return
    }

    const respostasAluno = respostas.map(resposta => ({
      alunoId: aluno.id,
      questaoId: resposta.questaoId,
      respostaId: resposta.respostaId
    }))

    sequelize.transaction(async (t) => {
      await Resposta.bulkCreate(respostasAluno, { transaction: t })

      res.json({ status: 'OK' })
    }).catch(err => {
      res.status(500).json({ message: `internal server error: ${err.message}` })
    })

  })
}
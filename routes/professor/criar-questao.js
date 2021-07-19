const sequelize = require('../../db-index')
const Disciplina = require('../../models/disciplina')
const Questao = require('../../models/questao')
const Alternativa = require('../../models/alternativa')
const auth = require('../auth')
const Enquete = require('../../models/enquete')

module.exports = function (app) {
  app.post('/criarQuestao', async (req, res) => {
    const professor = await auth(req, res)

    if (!professor) return

    if (professor.tipoUsuario !== 'P') {
      res.status(401).json({ message: "access danied" })
      return
    }

    const { quizzId: enqueteId, enunciado, alternativas } = req.body
    if (!enqueteId || !enunciado || !alternativas || !alternativas.length) {
      res.status(400).json({ message: "bad request" })
      return
    }

    const enquete = await Enquete.findByPk(enqueteId, { include: ['disciplina'] })
    if (!enquete || enquete.disciplina.professorId !== professor.id) {
      res.status(401).json({ message: "unauthorized" })
      return
    }

    sequelize.transaction(async (t) => {
      const questao = await Questao.create({
        enqueteId,
        enunciado
      }, { transaction: t })

      const addAlternativas = alternativas.map(alternativa => ({
        questaoId: questao.id,
        enunciado: alternativa.enunciado,
        alternativaCorreta: alternativa.correta
      }))
      await Alternativa.bulkCreate(addAlternativas, { transaction: t })

      res.json({ id: questao.id })

    }).catch(err => {
      res.status(500).json({ message: `internal server error: ${err.message}` })
    })

  })
}
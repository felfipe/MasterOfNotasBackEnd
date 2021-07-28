const auth = require('../auth')
const sequelize = require('../../db-index')

const Questao = require('../../models/questao')
const Enquete = require('../../models/enquete')
const Alternativa = require('../../models/alternativa')

module.exports = function (app) {
  app.post('/atualizarQuestao', async (req, res) => {
    const professor = await auth(req, res)

    if (!professor) return

    if (professor.tipo !== 'P') {
      res.status(401).json({ message: "access danied" })
      return
    }

    const { enqueteId, questaoId, enunciado, alternativas } = req.body
    if (!questaoId || !enunciado || !alternativas || !alternativas.length) {
      res.status(400).json({ message: "bad request" })
      return
    }

    const enquete = await Enquete.findByPk(enqueteId, { include: 'disciplina' })
    if (!enquete || enquete.disciplina.professorId !== professor.id) {
      res.status(401).json({ message: "unauthorized" })
      return
    }

    sequelize.transaction(async (t) => {
      await Questao.update({
        enunciado
      }, {
        where: { id: questaoId },
        transaction: t
      })

      await Alternativa.destroy({
        where: { questaoId },
        transaction: t
      })

      const addAlternativas = alternativas.map(alternativa => ({
        questaoId,
        enunciado: alternativa.enunciado,
        alternativaCorreta: alternativa.correta
      }))
      await Alternativa.bulkCreate(addAlternativas, { transaction: t })

      const questao = await Questao.findByPk(questaoId, {
        include: 'alternativas',
        transaction: t
      })
      res.json(questao)

    }).catch(err => {
      res.status(500).json({ message: `internal server error: ${err.message}` })
    })

  })
}
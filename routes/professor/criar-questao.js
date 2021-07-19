const sequelize = require('../../db-index')
const Disciplina = require('../../models/disciplina')
const Questao = require('../../models/questao')
const Alternativa = require('../../models/alternativa')
const auth = require('../auth')

module.exports = function (app) {
  app.post('/criarQuestao', async (req, res) => {
    const professor = await auth(req, res)

    if (!professor) return

    if (professor.tipoUsuario !== 'P') {
      res.status(401).json({ message: "access danied" })
      return
    }

    const { disciplineId: disciplinaId, enunciado, alternativas } = req.body
    if (!disciplinaId || !enunciado || !alternativas || !alternativas.length) {
      res.status(400).json({ message: "bad request" })
      return
    }

    const disciplina = await Disciplina.findByPk(disciplinaId)
    if (!disciplina || disciplina.professorId !== professor.id) {
      res.status(401).json({ message: "unauthorized" })
      return
    }

    sequelize.transaction(async (t) => {
      const questao = await Questao.create({
        disciplinaId,
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
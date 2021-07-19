const { Op } = require('sequelize')
const sequelize = require('../../db-index')
const AlunoDisciplina = require('../../models/aluno-disciplina')
const Disciplina = require('../../models/disciplina')
const Enquete = require('../../models/enquete')
const Questao = require('../../models/questao')
const auth = require('../auth')

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

module.exports = function (app) {
  app.post('/criarEnquete', async (req, res) => {
    const professor = await auth(req, res)

    if (!professor) return

    if (professor.tipoUsuario !== 'P') {
      res.status(401).json({ message: "access danied" })
      return
    }

    const { disciplineId: disciplinaId, amountQuest: quantidade, dataAbertura, dataFechamento } = req.body
    if (!disciplinaId || !quantidade) {
      res.status(400).json({ message: "bad request" })
      return
    }

    const disciplina = await Disciplina.findByPk(disciplinaId)
    if (!disciplina || disciplina.professorId !== professor.id) {
      res.status(401).json({ message: "unauthorized" })
      return
    }


    const now = new Date()
    const tomorrow = new Date()
    tomorrow.setDate(now.getDate() + 1)

    sequelize.transaction(async (t) => {
      const enqueteAberta = await Enquete.findOne({
        where: {
          disciplinaId,
          [Op.and]: [
            { dataAbertura: { [Op.lte]: now } },
            { dataFechamento: { [Op.gte]: now } }
          ]
        }
      })

      if (enqueteAberta) {
        res.status(409).json({ message: "conflict: quizz already open" })
        return
      }

      const enquete = await Enquete.create({
        disciplinaId,
        quantidade,
        dataAbertura: dataAbertura || now,
        dataFechamento: dataFechamento || tomorrow
      })


      const bancoQuestoes = await Questao.findAll({ where: { disciplinaId } })
      const alunosDisciplina = await AlunoDisciplina.findAll({ where: { disciplinaId } })

      if (bancoQuestoes.length < quantidade) {
        res.status(500).json({ message: `internal server error: ${err.message}` })
        return
      }
      alunosDisciplina.forEach(aluno => {
        const vetorQuestoes = []

        do {
          const questaoRand = getRandomInt(0, bancoQuestoes.length - 1);
          const questaoId = bancoQuestoes[questaoRand].id
          if (!vetorQuestoes.includes(questaoId)) vetorQuestoes.push(questaoId)

        } while (vetorQuestoes.length < quantidade)
      })


      res.json(enquete)
    }).catch(err => {
      res.status(500).json({ message: `internal server error: ${err.message}` })
    })

  })
}
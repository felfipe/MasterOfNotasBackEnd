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

    const { disciplineId: disciplinaId, amountQuest: quantidade, name: nome, active: ativo = false } = req.body
    if (!disciplinaId || !quantidade) {
      res.status(400).json({ message: "bad request" })
      return
    }

    const disciplina = await Disciplina.findByPk(disciplinaId)
    if (!disciplina || disciplina.professorId !== professor.id) {
      res.status(401).json({ message: "unauthorized" })
      return
    }

    if (ativo) {
      const enqueteAberta = await Enquete.findOne({
        where: {
          disciplinaId,
          ativo: true
        }
      })

      if (enqueteAberta) {
        res.status(409).json({ message: "conflict: quizz already open" })
        return
      }
    }

    const nomeEnquete = await Enquete.findOne({
      where: {
        disciplinaId,
        nome
      }
    })

    if (nomeEnquete) {
      res.status(409).json({ message: "conflict: quizz name in use" })
      return
    }

    const enquete = await Enquete.create({
      disciplinaId,
      quantidade,
      nome,
      ativo
    }).catch(err => {
      res.status(500).json({ message: `internal server error: ${err.message}` })
    })

    if (enquete) res.json(enquete)

  })
}
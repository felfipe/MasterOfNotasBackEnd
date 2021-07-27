const auth = require('../auth')
const { Op } = require('sequelize')
const Disciplina = require('../../models/disciplina')
const Enquete = require('../../models/enquete')

module.exports = function (app) {
  app.post('/atualizarEnquete', async (req, res) => {
    const professor = await auth(req, res)

    if (!professor) return

    if (professor.tipo !== 'P') {
      res.status(401).json({ message: "access danied" })
      return
    }

    const { disciplinaId, enqueteId, quantidade, nome } = req.body
    if (!disciplinaId || !enqueteId || !quantidade || !nome) {
      res.status(400).json({ message: "bad request" })
      return
    }

    const enquete = await Enquete.findByPk(enqueteId, { include: 'disciplina' })
    if (!enquete || enquete.disciplina.professorId !== professor.id) {
      res.status(401).json({ message: "unauthorized" })
      return
    }

    const nomeEnquete = await Enquete.findOne({
      where: {
        [Op.not]: { id: enqueteId },
        disciplinaId,
        nome
      }
    })

    if (nomeEnquete) {
      res.status(409).json({ message: "quizz name in use" })
      return
    }

    const [enqueteAtualizada] = await Enquete.update({
      quantidade,
      nome
    }, {
      where: {
        id: enqueteId
      }
    }).catch(err => {
      res.status(500).json({ message: `internal server error: ${err.message}` })
    })

    if (enqueteAtualizada === 1) res.json(enquete)

  })
}
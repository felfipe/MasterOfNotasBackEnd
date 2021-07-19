const { Op } = require('sequelize')
const Disciplina = require('../../models/disciplina')
const Enquete = require('../../models/enquete')
const auth = require('../auth')

module.exports = function (app) {
  app.post('/criarEnquete', async (req, res) => {
    const professor = await auth(req, res)

    if (!professor) return

    if (professor.tipoUsuario !== 'P') {
      res.status(401).json({ message: "access danied" })
      return
    }

    const { disciplineId: disciplinaId, dataAbertura, dataFechamento } = req.body
    if (!disciplinaId) {
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
      dataAbertura: dataAbertura || now,
      dataFechamento: dataFechamento || tomorrow
    }).catch(err => {
      res.status(500).json({ message: `Error! ${err.message}` })
    })

    if (enquete) res.json(enquete)
  })
}
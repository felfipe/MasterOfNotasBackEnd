const auth = require('../auth')
const Enquete = require('../../models/enquete')

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

module.exports = function (app) {
  app.post('/encerrarEnquete', async (req, res) => {
    const professor = await auth(req, res)

    if (!professor) return

    if (professor.tipo !== 'P') {
      res.status(401).json({ message: "access danied" })
      return
    }

    const { enqueteId } = req.body
    if (!enqueteId) {
      res.status(400).json({ message: "bad request" })
      return
    }

    const enquete = await Enquete.findByPk(enqueteId, { include: ['disciplina'] })
    if (!enquete || enquete.disciplina.professorId !== professor.id) {
      res.status(401).json({ message: "access danied" })
      return
    }

    if (!enquete.ativo) {
      res.status(409).json({ message: "quizz already closed" })
      return
    }

    await Enquete.update({ ativo: false }, { where: { id: enqueteId } }).catch(err => {
      res.status(500).json({ message: `internal server error: ${err.message}` })
    })

    res.json({ status: 'OK' })

  })
}
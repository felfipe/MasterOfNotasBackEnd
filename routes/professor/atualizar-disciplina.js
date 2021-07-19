const auth = require('../auth')
const Disciplina = require('../../models/disciplina')

module.exports = function (app) {
  app.post('/atualizarDisciplina', async (req, res) => {
    const professor = await auth(req, res)

    if (!professor) return

    if (professor.tipo !== 'P') {
      res.status(401).json({ message: "access danied" })
      return
    }

    const { disciplinaId: disciplinaId, nome, sigla } = req.body
    if (!disciplinaId || !nome) {
      res.status(400).json({ message: "bad resquest" })
      return
    }

    const disciplina = await Disciplina.findByPk(disciplinaId)
    if (!disciplina || disciplina.professorId !== professor.id) {
      res.status(401).json({ message: "access danied" })
      return
    }

    const disciplinaDuplicada = await Disciplina.findOne({ where: { nome, sigla } })
    if (disciplinaDuplicada) {
      res.status(409).json({ message: "discipline already exists" })
      return
    }

    const disciplinaAtulizada = await Disciplina.update({
      nome,
      sigla
    }, { where: { id: disciplinaId } }).catch(err => {
      res.status(500).json({ message: `internal server error:  ${err.message}` })
    })

    if (disciplinaAtulizada) {
      res.json({ status: 'OK' })
    }

  })
}
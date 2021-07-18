const Disciplina = require('../../models/disciplina')
const auth = require('../auth')

module.exports = function (app) {
  app.post('/atualizarDisciplina', async (req, res) => {
    usuario = await auth(req, res)
    if (!usuario) return

    const { disciplineId: disciplinaId, name: nome, initial: sigla } = req.body
    if (!disciplinaId || !nome) {
      res.status(400).json({ message: "Bad Request!" })
      return
    }

    const disciplina = await Disciplina.findByPk(disciplinaId)
    if (disciplina.emailProfessor !== usuario.email) {
      res.status(500).json({ message: "Access Danied!" })
      return
    }

    const disciplinaDuplicada = await Disciplina.findOne({ where: { nome, sigla } })
    if (disciplinaDuplicada) {
      res.status(500).json({ message: "Discipline already exists!" })
      return
    }

    await Disciplina.update({
      nome,
      sigla
    }, { where: { id: disciplinaId } })

    res.json({ status: 'OK' })

  })
}
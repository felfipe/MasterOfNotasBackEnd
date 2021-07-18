const Disciplina = require('../../models/disciplina')
const auth = require('../auth')

module.exports = function (app) {
  app.post('/criarDisciplina', async (req, res) => {
    usuario = await auth(req, res)
    if (!usuario) return

    const { name: nome, initial: sigla } = req.body

    const disciplina = await Disciplina.findOne({ where: { nome, sigla } })
    if (disciplina) {
      res.status(500).json({ message: "Discipline already exists!" })
      return
    }

    const { id: disciplinaId } = await Disciplina.create({
      nome,
      sigla,
      emailProfessor: usuario.email
    })

    res.json({ id: disciplinaId })
  })
}
const auth = require('../auth')
const Disciplina = require("../../models/disciplina")

module.exports = function (app) {
  app.get('/listarDisciplinas', async (req, res) => {
    const professor = await auth(req, res)

    if (!professor) return

    if (professor.tipoUsuario !== 'P') {
      res.status(401).json({ message: "access danied" })
      return
    }

    const disciplinas = await Disciplina.findAll({
      where: {
        professorId: professor.id
      }
    })

    res.json(disciplinas)
  })
}
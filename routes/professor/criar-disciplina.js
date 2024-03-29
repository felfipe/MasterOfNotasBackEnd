const sequelize = require('../../db-index')
const auth = require('../auth')

const Disciplina = require('../../models/disciplina')
const AlunoDisciplina = require('../../models/aluno-disciplina')

module.exports = function (app) {
  app.post('/criarDisciplina', async (req, res) => {
    const professor = await auth(req, res)

    if (!professor) return

    if (professor.tipo !== 'P') {
      res.status(401).json({ message: "access danied" })
      return
    }

    const { nome, sigla, alunosId = [] } = req.body
    if (!nome) {
      res.status(400).json({ message: "bad request" })
      return
    }

    const disciplinaDuplicada = await Disciplina.findOne({ where: { nome, sigla } })
    if (disciplinaDuplicada) {
      res.status(409).json({ message: "discipline already exists" })
      return
    }

    sequelize.transaction(async (t) => {
      const disciplina = await Disciplina.create({
        nome,
        sigla,
        professorId: professor.id
      }, { transaction: t })

      const addAlunos = alunosId.map(alunoId => ({ disciplinaId: disciplina.id, alunoId }))
      await AlunoDisciplina.bulkCreate(addAlunos, { transaction: t })

      res.json({ id: disciplina.id })

    }).catch(err => {
      res.status(500).json({ message: `internal server error: ${err.message}` })
    })

  })
}
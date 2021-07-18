const sequelize = require('../../db-index')
const Disciplina = require('../../models/disciplina')
const AlunoDisciplina = require('../../models/aluno-disciplina')
const auth = require('../auth')

module.exports = function (app) {
  app.post('/criarDisciplina', async (req, res) => {
    usuario = await auth(req, res)
    if (!usuario) return

    const { name: nome, initial: sigla, alunos = [] } = req.body
    if (!nome) {
      res.status(400).json({ message: "Bad Request!" })
      return
    }

    const disciplinaDuplicada = await Disciplina.findOne({ where: { nome, sigla } })
    if (disciplinaDuplicada) {
      res.status(500).json({ message: "Discipline already exists!" })
      return
    }

    sequelize.transaction(async (t) => {
      const disciplina = await Disciplina.create({
        nome,
        sigla,
        emailProfessor: usuario.email
      }, { transaction: t })

      const addAlunos = alunos.map(aluno => ({ disciplinaId: disciplina.id, emailAluno: aluno.email }))
      await AlunoDisciplina.bulkCreate(addAlunos, { transaction: t })

      res.json({ id: disciplina.id })

    }).catch(err => {
      res.status(500).json({ message: `Error! ${err}` })
    })

  })
}
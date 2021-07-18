const sequelize = require('../../db-index')
const Disciplina = require('../../models/disciplina')
const AlunoDisciplina = require('../../models/aluno-disciplina')
const auth = require('../auth')

module.exports = function (app) {
  app.post('/setAlunosDisciplina', async (req, res) => {
    const professor = await auth(req, res)

    if (!professor) return

    if (professor.tipoUsuario !== 'P') {
      res.status(401).json({ message: "access danied" })
      return
    }

    const { disciplineId: disciplinaId, alunos } = req.body
    if (!disciplinaId || !alunos) {
      res.status(400).json({ message: "bad request" })
      return
    }

    const disciplina = await Disciplina.findByPk(disciplinaId)
    if (disciplina.emailProfessor !== professor.email) {
      res.status(401).json({ message: "access danied" })
      return
    }

    const alunosAtual = await AlunoDisciplina.findAll({ raw: true, where: { disciplinaId } })

    const alunosAdd = alunos.filter(aluno => !alunosAtual.find(alunoAtual => aluno.email === alunoAtual.emailAluno))
    const alunosRemove = alunosAtual.filter(alunoAtual => !alunos.find(aluno => aluno.email === alunoAtual.emailAluno))

    sequelize.transaction(async (t) => {
      const alunosAddObj = alunosAdd.map(aluno => ({ disciplinaId, emailAluno: aluno.email }))
      await AlunoDisciplina.bulkCreate(alunosAddObj, { transaction: t })

      const alunosEmailRemove = alunosRemove.map(aluno => aluno.emailAluno)
      await AlunoDisciplina.destroy({ where: { disciplinaId, emailAluno: alunosEmailRemove } }, { transaction: t })

      res.json({ status: 'OK' })

    }).catch(err => {
      res.status(500).json({ message: `internal server error: ${err.message}` })
    })

  })
}
const sequelize = require('../../db-index')
const Disciplina = require('../../models/disciplina')
const AlunoDisciplina = require('../../models/aluno-disciplina')
const auth = require('../auth')

module.exports = function (app) {
  app.post('/setAlunosDisciplina', async (req, res) => {
    usuario = await auth(req, res)
    if (!usuario) return

    const { disciplineId: disciplinaId, alunos } = req.body
    if (!disciplinaId || !alunos) {
      res.status(400).json({ message: "Bad Request!" })
      return
    }

    const disciplina = await Disciplina.findByPk(disciplinaId)
    if (disciplina.emailProfessor !== usuario.email) {
      res.status(500).json({ message: "Access Danied!" })
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
      res.status(500).json({ message: `Error! ${err}` })
    })

  })
}
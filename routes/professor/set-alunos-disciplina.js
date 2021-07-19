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

    const { disciplineId: disciplinaId, alunosId } = req.body
    if (!disciplinaId || !alunosId) {
      res.status(400).json({ message: "bad request" })
      return
    }

    const disciplina = await Disciplina.findByPk(disciplinaId)
    if (!disciplina || disciplina.professorId !== professor.id) {
      res.status(401).json({ message: "access danied" })
      return
    }

    const alunosAtual = await AlunoDisciplina.findAll({ raw: true, where: { disciplinaId } })

    const alunosAdd = alunosId.filter(alunoId => !alunosAtual.find(alunoAtual => +alunoId === +alunoAtual.alunoId))
    const alunosRemove = alunosAtual.filter(alunoAtual => !alunosId.includes(+alunoAtual.alunoId))

    sequelize.transaction(async (t) => {
      const alunosAddObj = alunosAdd.map(alunoId => ({ disciplinaId, alunoId }))
      await AlunoDisciplina.bulkCreate(alunosAddObj, { transaction: t })

      const alunosEmailRemove = alunosRemove.map(aluno => aluno.alunoId)
      await AlunoDisciplina.destroy({ where: { disciplinaId, alunoId: alunosEmailRemove } }, { transaction: t })

      res.json({ status: 'OK' })

    }).catch(err => {
      res.status(500).json({ message: `internal server error: ${err.message}` })
    })

  })
}
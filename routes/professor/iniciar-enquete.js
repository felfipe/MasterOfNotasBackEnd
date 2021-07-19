const sequelize = require('../../db-index')
const auth = require('../auth')

const AlunoDisciplina = require('../../models/aluno-disciplina')
const Enquete = require('../../models/enquete')
const Questao = require('../../models/questao')
const Questionario = require('../../models/questionario')

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

module.exports = function (app) {
  app.post('/iniciarEnquete', async (req, res) => {
    const professor = await auth(req, res)

    if (!professor) return

    if (professor.tipoUsuario !== 'P') {
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

    const enqueteAtiva = await Enquete.findOne({ where: { disciplinaId: enquete.disciplinaId, ativo: true } })
    if (enqueteAtiva || enquete.ativo) {
      res.status(409).json({ message: "quizz already started" })
      return
    }

    const bancoQuestoes = await Questao.findAll({ where: { enqueteId } })
    const alunosMatriculados = await AlunoDisciplina.findAll({ where: { disciplinaId: enquete.disciplinaId } })

    if (bancoQuestoes.length < enquete.quantidade) {
      res.status(409).json({ message: "insufficient database questions" })
      return
    }

    sequelize.transaction(async (t) => {
      await Enquete.update({ ativo: true }, { where: { id: enqueteId }, transaction: t })

      const promises = []
      alunosMatriculados.forEach(aluno => {
        const questoesAluno = []
        do {
          const questaoAleatoria = getRandomInt(0, bancoQuestoes.length - 1)
          const questaoId = bancoQuestoes[questaoAleatoria].id
          if (!questoesAluno.includes(questaoId)) questoesAluno.push(questaoId)
        } while (questoesAluno.length < enquete.quantidade)

        const promise = Questionario.create({
          enqueteId,
          alunoId: aluno.alunoId,
          questoesId: questoesAluno
        }, { transaction: t })

        promises.push(promise)
      })

      await Promise.all(promises)

      res.json({ status: 'OK' })

    }).catch(err => {
      res.status(500).json({ message: `internal server error: ${err.message}` })
    })

  })
}
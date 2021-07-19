const auth = require('../auth')

const AlunoDisciplinas = require("../../models/aluno-disciplina")
const Enquete = require("../../models/enquete")
const Questionario = require("../../models/questionario")

module.exports = function (app) {
  app.get('/listarEnquetesDisponiveis', async (req, res) => {
    const aluno = await auth(req, res)

    if (!aluno) return

    if (aluno.tipoUsuario !== 'A') {
      res.status(401).json({ message: "access danied" })
      return
    }

    const enquetes = await Questionario.findAll({
      where: {
        alunoId: aluno.id
      },
      include: [
        {
          association: 'enquete',
          where: { ativo: true },
          include: [
            {
              association: 'disciplina',
              include: ['professor']
            }]
        }
      ]
    })

    const alunoEnquetes = enquetes.map(qq => ({
      quizzId: qq.id,
      name: qq.enquete.nome,
      discipline: {
        id: qq.enquete.disciplinaId,
        name: qq.enquete.disciplina.nome,
        initial: qq.enquete.disciplina.sigla
      },
      professor: qq.enquete.disciplina.professor.nome
    }))

    res.json(alunoEnquetes)
  })
}
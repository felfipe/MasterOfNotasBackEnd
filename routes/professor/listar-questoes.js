const auth = require('../auth')

const Questao = require("../../models/questao")
const Questionario = require('../../models/questionario')
const Enquete = require('../../models/enquete')

module.exports = function (app) {
    app.get('/listarQuestoes', async (req, res) => {
        const professor = await auth(req, res)

        if (!professor) return

        if (professor.tipo !== 'P') {
            res.status(401).json({ message: "access danied" })
            return
        }

        const { enqueteId } = req.query
        if (!enqueteId) {
            res.status(400).json({ message: "bad request" })
            return
        }

        const enquete = await Enquete.findByPk(enqueteId, { include: 'disciplina' })
        if (!enquete || enquete.disciplina.professorId !== professor.id) {
            res.status(401).json({ message: "unauthorized" })
            return
        }

        const questoes = await Questao.findAll({
            where: {
                enqueteId
            }, include: ['alternativas']
        }).map(questao => ({
            questaoId: questao.id,
            enunciado: questao.enunciado,
            alternativas: questao.alternativas.map(alt => ({
                alternativaId: alt.id,
                enunciado: alt.enunciado,
                alternativaCorreta: alt.alternativaCorreta
            }))
        }))

        res.json(questoesQuestionario)
    })
}
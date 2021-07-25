const auth = require('../auth')

const Questao = require("../../models/questao")
const Questionario = require('../../models/questionario')

module.exports = function (app) {
    app.get('/listarQuestoesQuestionario', async (req, res) => {
        const professor = await auth(req, res)

        if (!professor) return

        if (professor.tipo !== 'P') {
            res.status(401).json({ message: "access danied" })
            return
        }

        const { idQuestionario } = req.query
        if (!idQuestionario) {
            res.status(400).json({ message: "bad request" })
            return
        }

        const questionario = await Questionario.findOne({
            where: {
                id: idQuestionario
            }
        })
        if (!questionario) {
            res.status(401).json({ message: "not exists" })
            return
        }

        const questoes = await Questao.findAll({ where: { id: questionario.questoesId }, include: ['alternativas'] })

        const questoesQuestionario = questoes.map(questao => ({
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
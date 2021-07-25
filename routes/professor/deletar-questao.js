const auth = require('../auth')
const Questionario = require("../../models/questionario")

module.exports = function (app) {
    app.post('/deletarQuestao', async (req, res) => {
        const professor = await auth(req, res)
        if (!professor) return

        if (professor.tipo !== "P") {
            res.status(401).json({ message: "access danied" })
            return
        }
        const { idQuestionario, idQuestao } = req.body;

        if (!idQuestionario | !idQuestao) {
            res.status(401).json({ message: "Bad request!" })
            return
        }



        questionario = await Questionario.findByPk(idQuestionario)
        if (!questionario.questoesId.includes(parseInt(idQuestao))) {
            res.status(401).json({ message: "Question not associated!" })
            return
        }


        const index = questionario.questoesId.indexOf(parseInt(idQuestao))
        questionario.questoesId.splice(index, 1)

        const questionarioUpdate = await Questionario.update({
            questoesId: questionario.questoesId
        }, {
            where: {
                id: idQuestionario
            }
        })
        if (questionarioUpdate)
            res.json({ message: "Success!" })
    })
}
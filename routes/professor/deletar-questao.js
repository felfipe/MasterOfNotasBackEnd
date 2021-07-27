const auth = require('../auth')
const Enquete = require("../../models/enquete")
const Questao = require("../../models/questao")

module.exports = function (app) {
    app.post('/deletarQuestao', async (req, res) => {
        const professor = await auth(req, res)
        if (!professor) return

        if (professor.tipo !== "P") {
            res.status(401).json({ message: "access danied" })
            return
        }

        const { enqueteId, questaoId } = req.body;

        if (!enqueteId || !questaoId) {
            res.status(401).json({ message: "Bad request!" })
            return
        }

        const enquete = await Enquete.findByPk(enqueteId, { include: 'disciplina' })
        if (!enquete || enquete.disciplina.professorId !== professor.id) {
            res.status(401).json({ message: "unauthorized" })
            return
        }

        await Questao.destroy({
            where: {
                id: questaoId
            }
        })

        res.json({ message: "Success!" })
    })
}
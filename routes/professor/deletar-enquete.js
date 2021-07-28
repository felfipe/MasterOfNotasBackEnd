const auth = require('../auth')
const Enquete = require("../../models/enquete")

module.exports = function (app) {
    app.post('/deletarEnquete', async (req, res) => {
        const professor = await auth(req, res)
        if (!professor) return

        if (professor.tipo !== "P") {
            res.status(401).json({ message: "access danied" })
            return
        }

        const { enqueteId } = req.body
        if (!enqueteId) {
            res.status(400).json({ message: "bad request" })
            return
        }

        const enquete = await Enquete.findByPk(enqueteId, { include: 'disciplina' })

        if (!enquete || enquete.disciplina.professorId !== professor.id) {
            res.status(401).json({ message: "unauthorized" })
            return
        }

        await Enquete.destroy({ where: { id: enqueteId } })
        res.json({ message: "Success!" })
    })
}
const auth = require('../auth')
const Disciplina = require("../../models/disciplina")

module.exports = function (app) {
    app.post('/deletarDisciplina', async (req, res) => {
        const professor = await auth(req, res)
        if (!professor) return

        if (professor.tipo !== "P") {
            res.status(401).json({ message: "access danied" })
            return
        }

        const { idDisciplina } = req.body
        if (!idDisciplina) {
            res.status(400).json({ message: "bad request" })
            return
        }

        const disciplina = await Disciplina.findByPk(idDisciplina)

        if (!disciplina || disciplina.professorId !== professor.id) {
            res.status(401).json({ message: "unauthorized" })
            return
        }

        await disciplina.destroy()
        res.json({ message: "Success!" })
    })
}
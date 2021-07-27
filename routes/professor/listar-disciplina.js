const auth = require('../auth')
const Disciplina = require("../../models/disciplina")

module.exports = function (app) {
    app.get('/listarDisciplina', async (req, res) => {
        const professor = await auth(req, res)
        if (!professor) return

        if (!req.query.disciplinaId) {
            res.status(400).json({ message: "Bad request!" })
            return
        }

        const { disciplinaId } = req.body
        const disciplina = await Disciplina.findByPk(disciplinaId)
        if (!disciplina || disciplina.professorId !== professor.id) {
            res.status(401).json({ message: "unauthorized" })
            return
        }

        res.json(disciplina)
    })
}
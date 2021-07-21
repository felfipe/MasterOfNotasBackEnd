const auth = require('../auth')
const Disciplina = require("../../models/disciplina")

module.exports = function (app) {
    app.get('/listarDisciplina', async (req, res) => {
        const professor = await auth(req, res)
        if (!professor) return

        if (!req.query.idDisciplina) {
            res.status(400).json({ message: "Bad request!" })
            return
        }


        const disciplina = await Disciplina.findByPk(req.query.idDisciplina)
        if (!disciplina) {
            res.status(401).json({ message: "Disciplina not found!" })
            return
        }
        res.json(disciplina)
    })
}
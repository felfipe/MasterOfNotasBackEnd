const auth = require('../auth')
const Disciplina = require("../../models/disciplina")

module.exports = function (app) {
    app.post('/deletarDisciplina', async (req, res) => {
        const professor = await auth(req, res)
        if (!professor) return

        if (!req.body.idDisciplina) {
            res.status(401).json({ message: "Bad request!" })
            return
        }
        if (professor.tipo !== "P") {
            res.status(401).json({ message: "access danied" })
            return
        }


        const disciplina = await Disciplina.findByPk(req.body.idDisciplina)

        if (!disciplina) {
            res.status(401).json({ message: "Disciplina not found!" })
            return
        }

        await disciplina.destroy()
        res.json({ message: "Success!" })
    })
}
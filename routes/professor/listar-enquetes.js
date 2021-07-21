const auth = require('../auth')
const Enquete = require('../../models/enquete')

module.exports = function (app) {
    app.get('/listarEnquetes', async (req, res) => {
        const professor = await auth(req, res)

        if (!professor) return

        if (professor.tipo !== 'P') {
            res.status(401).json({ message: "access danied" })
            return
        }

        const enquetes = await Enquete.findAll({ include: [{ association: 'disciplina', where: { professorId: professor.id } }] })

        res.json(enquetes)
    })
}
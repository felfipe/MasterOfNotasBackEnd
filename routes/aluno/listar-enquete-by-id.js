const auth = require('../auth')
const Enquete = require('../../models/enquete')

module.exports = function (app) {
    app.get('/listarEnqueteById', async (req, res) => {
        const usuario = await auth(req, res)
        if (!usuario) return
        const idEnquete = req.query.idEnquete

        if (!idEnquete) {
            res.status(401).json({ message: "Bad Request!" })
            return
        }

        const enquetes = await Enquete.findByPk(req.query.idEnquete)

        res.json(enquetes)
    })
}
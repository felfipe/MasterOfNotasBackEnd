const Aluno = require("../models/aluno")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = function (app) {
    app.post('/auth', async (req, res) => {
        email = req.body.email
        password = req.body.password
        if (email == null || password == null) {
            res.status(500).json({ message: "Bad Requirement!" })
            return
        }

        const query_response = await Aluno.findOne({ where: { login: email } })


        if (query_response == null)
            res.status(500).json({ message: "Login Inválido!" })
        else {
            verifyPassword = await bcrypt.compare(password, query_response.password)
            if (!verifyPassword) {
                res.status(500).json({ message: "Login Inválido!" })
                return
            }
            const id = query_response.login;
            const token = jwt.sign({ id }, process.env.SECRET, {
                expiresIn: 1200 // 20 min
            })
            res.json({ auth: true, token: token, name: query_response.name, userType: query_response.tipoUsuario })
        }
    })
}
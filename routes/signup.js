const Usuario = require("../models/usuario")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const minute = 60

module.exports = function (app) {
    app.post('/signup', async (req, res) => {
        const { password, name: username, userType, email } = req.body

        if (req.body.length != 4 && (!email || !password || !username || !userType)) {
            res.status(500).json({ message: "Bad Requirement!" })
            return
        }

        if (username == "" || (userType != "PROFESSOR" && userType != "ALUNO")) {
            res.status(500).json({ message: "Empty name or type" })
            return
        }

        if (!email.includes('@') || !email.includes('.com')) {
            res.status(500).json({ message: "Wrong usarname!" })
            return
        }

        if (password.length < 6) {
            res.status(500).json({ message: "Wrong password!" })
            return
        }

        const emailInUse = await Usuario.findByPk(email)
        if (emailInUse) {
            res.status(500).json({ message: "User already exists!" })
            return
        }

        const salt = await bcrypt.genSalt()
        const hash = await bcrypt.hash(password, salt)

        const usuario = await Usuario.create({
            email,
            senha: hash,
            nome: username,
            tipoUsuario: (userType == "PROFESSOR") ? 'P' : 'A'
        })

        if (!usuario) res.status(500).json({ message: "Invalid singup!" })

        const token = jwt.sign({ id: email }, process.env.SECRET, { expiresIn: 20 * minute })
        
        res.json({ auth: true, token: token, name: username, userType: userType })

    })
}
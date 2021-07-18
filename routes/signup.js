const Aluno = require("../models/aluno")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

module.exports = function (app) {
    app.post('/signup', async (req, res) => {
        email = req.body.email
        password = req.body.password
        username = req.body.name
        userType = req.body.userType

        if (req.body.length != 4 && (email == null || password == null || username == null || userType == null)) {
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
        const query_response = await Aluno.findOne({ where: { login: email } })
        if (query_response != null) {
            res.status(500).json({ message: "User already exists!" })
            return
        }

        const salt = await bcrypt.genSalt()
        const hash = await bcrypt.hash(password, salt)

        console.log(email + username + hash + userType)
        const value = Aluno.build({ login: email, password: hash, name: username, tipoUsuario: userType })
        if (value == null)
            res.status(500).json({ message: "Invalid singup!" })
        value.save()
        const id = email;
        const token = jwt.sign({ id }, process.env.SECRET, {
            expiresIn: 1200 // 20 min
        })
        res.json({ auth: true, token: token, name: username, userType: userType })

    })
}
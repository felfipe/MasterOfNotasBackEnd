const Usuario = require("../models/usuario")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

module.exports = async (req, res) => {
  try {
    const { accesstoken: token } = req.headers
    const decodeToken = jwt.verify(token, process.env.SECRET)
    const usuario = await Usuario.findOne({ where: { id: decodeToken.id, tipoUsuario: 'P' } })
    if (!usuario) {
      res.status(500).json({ message: "Access Danied!" })
      return
    }
    return usuario

  } catch (error) {
    res.status(500).json({ message: "Access Danied!" })
    return
  }
}
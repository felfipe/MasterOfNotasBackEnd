const Usuario = require("../models/usuario")
const jwt = require('jsonwebtoken')

module.exports = async (req, res) => {
  try {
    const { accesstoken: token } = req.headers
    const decodeToken = jwt.verify(token, process.env.SECRET)
    const usuario = await Usuario.findOne({ where: { id: decodeToken.id } })
    if (!usuario) {
      res.status(403).json({ message: "invalid access token" })
      return
    }
    return usuario

  } catch (error) {
    res.status(403).json({ message: "invalid access token" })
  }
}
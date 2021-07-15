
const Sequelize = require('sequelize')
const dbconfig = require('./config/config.json')
const sequelizeModels = require('./models/')

const connection = new Sequelize(dbconfig)

sequelizeModels.initModels(connection)

module.exports = connection
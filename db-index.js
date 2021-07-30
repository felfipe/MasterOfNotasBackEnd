
const Sequelize = require('sequelize')
const sequelizeModels = require('./models/')



const dbconfig = {
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      },
      keepAlive: true
    },
    ssl: true,
    logging: false,
    seederStorage: "sequelize",
    define: {
      timestamps: true,
      underscored: true
    }
}










const connection = new Sequelize(dbconfig)

sequelizeModels.initModels(connection)

module.exports = connection
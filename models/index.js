const Testes = require('./teste')


function initModels(connection) {
  Testes.init(connection)

  Testes.associate(connection.models)
}

module.exports = { initModels }
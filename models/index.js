const Testes = require('./teste')
const Aluno = require('./aluno')

function initModels(connection) {
  Testes.init(connection)
  Aluno.init(connection)

  Testes.associate(connection.models)
  Aluno.associate(connection.models)
}

module.exports = { initModels }
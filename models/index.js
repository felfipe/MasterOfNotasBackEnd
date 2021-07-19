const Usuario = require('./usuario')
const Disciplina = require('./disciplina')
const AlunoDisciplina = require('./aluno-disciplina')
const Questao = require('./questao')
const Alternativa = require('./alternativa')
const Enquete = require('./enquete')
const Questionario = require('./questionario')
const Resposta = require('./resposta')

function initModels(connection) {
  Usuario.init(connection)
  Disciplina.init(connection)
  AlunoDisciplina.init(connection)
  Enquete.init(connection)
  Questao.init(connection)
  Alternativa.init(connection)
  Questionario.init(connection)
  Resposta.init(connection)

  Usuario.associate(connection.models)
  Disciplina.associate(connection.models)
  AlunoDisciplina.associate(connection.models)
  Enquete.associate(connection.models)
  Questao.associate(connection.models)
  Alternativa.associate(connection.models)
  Questionario.associate(connection.models)
  Resposta.associate(connection.models)
}

module.exports = { initModels }
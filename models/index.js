const Usuario = require('./usuario')
const Disciplina = require('./disciplina')
const Questao = require('./questao')
const Alternativa = require('./alternativa')
const AlunoDisciplina = require('./aluno-disciplina')
const Questionario = require('./enquete')
const Quizz = require('./questionario')
const Resposta = require('./resposta')

function initModels(connection) {
  Usuario.init(connection)
  Disciplina.init(connection)
  Questao.init(connection)
  Alternativa.init(connection)
  AlunoDisciplina.init(connection)
  Questionario.init(connection)
  Quizz.init(connection)
  Resposta.init(connection)

  Usuario.associate(connection.models)
  Disciplina.associate(connection.models)
  Questao.associate(connection.models)
  Alternativa.associate(connection.models)
  AlunoDisciplina.associate(connection.models)
  Questionario.associate(connection.models)
  Quizz.associate(connection.models)
  Resposta.associate(connection.models)
}

module.exports = { initModels }
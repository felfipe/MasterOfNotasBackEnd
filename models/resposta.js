const { Model, DataTypes } = require('sequelize')

class Resposta extends Model {
  static init(sequelize) {
    super.init({
    }, {
      sequelize: sequelize,
      tableName: 'respostas'
    })
  }

  static associate(models) {
    this.belongsTo(models.Usuario, {
      foreignKey: { field: 'aluno_id', name: 'alunoId' },
      as: 'aluno'
    })

    this.belongsTo(models.Questao, {
      foreignKey: { field: 'questao_id', name: 'questaoId' },
      as: 'questao'
    })

    this.belongsTo(models.Alternativa, {
      foreignKey: { field: 'resposta_id', name: 'respostaId' },
      as: 'resposta'
    })
  }
}

module.exports = Resposta
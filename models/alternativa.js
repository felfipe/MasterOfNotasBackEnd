const { Model, DataTypes } = require('sequelize')

class Alternativa extends Model {
  static init(sequelize) {
    super.init({
      enunciado: DataTypes.TEXT,
      alternativaCorreta: { field: 'alternativa_correta', type: DataTypes.BOOLEAN }
    }, {
      sequelize: sequelize,
      tableName: 'alternativas'
    })
  }

  static associate(models) {
    this.belongsTo(models.Disciplina, {
      foreignKey: { field: 'questao_id', name: 'questaoId' },
      as: 'questao'
    })
  }
}

module.exports = Alternativa
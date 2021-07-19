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
    this.belongsTo(models.Questionario, {
      foreignKey: 'id',
      as: 'questionario'
    })

    this.belongsTo(models.Alternativa, {
      foreignKey: 'id',
      as: 'alternativa'
    })
  }
}

module.exports = Resposta
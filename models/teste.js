const { Model, DataTypes } = require('sequelize')

class Teste extends Model {
  static init(sequelize) {
    super.init({

    }, {
      sequelize: sequelize,
      tableName: 'testes'
    })
  }

  static associate(models) {
  }
}

module.exports = Teste

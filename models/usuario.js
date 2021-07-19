const { Model, DataTypes } = require('sequelize')

class Usuario extends Model {
  static init(sequelize) {
    super.init({
      email: DataTypes.STRING,
      senha: DataTypes.STRING,
      nome: DataTypes.STRING,
      tipo: DataTypes.STRING,
    }, {
      sequelize: sequelize,
      tableName: 'usuarios'
    })
  }

  static associate(models) {
  }
}

module.exports = Usuario

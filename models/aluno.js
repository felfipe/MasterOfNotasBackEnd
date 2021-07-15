const { Model, DataTypes } = require('sequelize')

class Aluno extends Model {
  static init(sequelize) {
    super.init({
        name: DataTypes.STRING,
        login: DataTypes.STRING,
        password: DataTypes.STRING,
        tipoUsuario: DataTypes.STRING,
    }, {
      sequelize: sequelize,
      tableName: 'aluno'
    })
  }

  static associate(models) {
  }
}

module.exports = Aluno

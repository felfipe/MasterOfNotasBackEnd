const { Model, DataTypes } = require('sequelize')

class Quizz extends Model {
  static init(sequelize) {
    super.init({
      questoesId: { field: 'questoes_id', type: DataTypes.ARRAY(DataTypes.INTEGER) }
    }, {
      sequelize: sequelize,
      tableName: 'quizz'
    })
  }

  static associate(models) {
    this.belongsTo(models.Questionario, {
      foreignKey: 'id',
      as: 'questionario'
    })

    this.belongsTo(models.Usuario, {
      foreignKey: 'email',
      as: 'aluno'
    })
  }
}

module.exports = Quizz
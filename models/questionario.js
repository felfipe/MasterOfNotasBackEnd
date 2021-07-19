const { Model, DataTypes } = require('sequelize')

class Questionario extends Model {
  static init(sequelize) {
    super.init({
      questoesId: { field: 'questoes_id', type: DataTypes.ARRAY(DataTypes.INTEGER) }
    }, {
      sequelize: sequelize,
      tableName: 'questionario'
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

module.exports = Questionario
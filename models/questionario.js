const { Model, DataTypes } = require('sequelize')

class Questionario extends Model {
  static init(sequelize) {
    super.init({
      questoesId: { field: 'questoes_id', type: DataTypes.ARRAY(DataTypes.INTEGER) }
    }, {
      sequelize: sequelize,
      tableName: 'questionarios'
    })
  }

  static associate(models) {
    this.belongsTo(models.Enquete, {
      foreignKey: { field: 'enquete_id', name: 'enqueteId' },
      as: 'enquete'
    })

    this.belongsTo(models.Usuario, {
      foreignKey: { field: 'aluno_id', name: 'alunoId' },
      as: 'aluno'
    })
  }
}

module.exports = Questionario
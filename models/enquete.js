const { Model, DataTypes } = require('sequelize')

class Enquete extends Model {
  static init(sequelize) {
    super.init({
      quantidade: DataTypes.INTEGER,
      nome: DataTypes.STRING,
      ativo: DataTypes.BOOLEAN
    }, {
      sequelize: sequelize,
      tableName: 'enquetes'
    })
  }

  static associate(models) {
    this.belongsTo(models.Disciplina, {
      foreignKey: { field: 'disciplina_id', name: 'disciplinaId' },
      as: 'disciplina'
    })
  }
}

module.exports = Enquete
const { Model, DataTypes } = require('sequelize')

class Enquete extends Model {
  static init(sequelize) {
    super.init({
      dataAbertura: { field: 'data_abertura', type: DataTypes.DATE },
      dataFechamento: { field: 'data_fechamento', type: DataTypes.DATE }
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
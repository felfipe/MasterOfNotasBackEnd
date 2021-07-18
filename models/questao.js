const { Model, DataTypes } = require('sequelize')

class Questao extends Model {
  static init(sequelize) {
    super.init({
      enunciado: DataTypes.TEXT
    }, {
      sequelize: sequelize,
      tableName: 'questoes'
    })
  }

  static associate(models) {
    this.belongsTo(models.Disciplina, {
      foreignKey: { field: 'disciplina_id', name: 'disciplinaId' },
      as: 'disciplina'
    })
  }
}

module.exports = Questao
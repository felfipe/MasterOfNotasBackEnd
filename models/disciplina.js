const { Model, DataTypes } = require('sequelize')

class Disciplina extends Model {
  static init(sequelize) {
    super.init({
      nome: DataTypes.STRING,
      sigla: DataTypes.STRING
    }, {
      sequelize: sequelize,
      tableName: 'disciplinas'
    })
  }

  static associate(models) {
    this.belongsTo(models.Usuario, {
      foreignKey: { field: 'professor_id', name: 'professorId' },
      as: 'professor'
    })
  }
}

module.exports = Disciplina
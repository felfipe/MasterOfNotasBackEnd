const { Model, DataTypes } = require('sequelize')

class AlunoDisciplina extends Model {
  static init(sequelize) {
    super.init({
    }, {
      sequelize: sequelize,
      tableName: 'aluno_disciplinas'
    })
  }

  static associate(models) {
    this.belongsTo(models.Usuario, {
      foreignKey: 'email',
      as: 'aluno'
    })

    this.belongsTo(models.Disicplina, {
      foreignKey: { field: 'disciplina_id', name: 'disciplinaId' },
      as: 'disciplina'
    })
  }
}

module.exports = AlunoDisciplina
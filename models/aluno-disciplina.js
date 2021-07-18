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
      foreignKey: { field: 'email_aluno', name: 'emailAluno' },
      as: 'aluno'
    })

    this.belongsTo(models.Disciplina, {
      foreignKey: { field: 'disciplina_id', name: 'disciplinaId' },
      as: 'disciplina'
    })
  }
}

module.exports = AlunoDisciplina
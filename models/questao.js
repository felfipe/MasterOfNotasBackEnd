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
    this.belongsTo(models.Enquete, {
      foreignKey: { field: 'enquete_id', name: 'enqueteId' },
      as: 'enquete'
    })

    this.hasMany(models.Alternativa, {
      foreignKey: { field: 'questao_id', name: 'questaoId' },
      as: 'alternativas'
    })
  }
}

module.exports = Questao
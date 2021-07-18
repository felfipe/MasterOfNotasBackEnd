'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('disciplinas', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },

      email_professor: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'email'
        }
      },

      nome: {
        type: Sequelize.STRING,
        allowNull: false
      },

      sigla: {
        type: Sequelize.STRING(5)
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      },

      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('disciplinas');
  }
}
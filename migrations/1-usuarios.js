'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('usuarios', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },

      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },

      senha: {
        type: Sequelize.STRING,
        allowNull: false
      },

      nome: {
        type: Sequelize.STRING,
        allowNull: false
      },

      tipo: {
        type: Sequelize.STRING(1),
        allowNull: false,
        defaultValue: 'A'
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
    await queryInterface.dropTable('usuarios');
  }
}
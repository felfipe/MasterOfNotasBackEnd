'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('questoes', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      
      enquete_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'enquetes',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },

      enunciado: {
        type: Sequelize.TEXT,
        allowNull: false
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      },
      respondido: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: Sequelize.literal('NOW()')
      },
      nota: {
        allowNull: false,
        type: Sequelize.REAL,
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
    await queryInterface.dropTable('questoes');
  }
}
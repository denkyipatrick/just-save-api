'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Stocks', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      dateClosed: {
        type: Sequelize.DATE
      },
      isActive: {
        defaultValue: false,
        type: Sequelize.BOOLEAN
      },
      type: {
        type: Sequelize.ENUM,
        values: ['warehouse', 'branch']
      },
      companyId: {
        allowNull: false,
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
          model: 'Companies',
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Stocks');
  }
};
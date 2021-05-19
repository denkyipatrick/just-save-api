'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('BranchStocks', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      stockId: {
        allowNull: false,
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
          model: 'Stocks',
          key: 'id'
        }
      },
      branchId: {
        allowNull: false,
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
          model: 'Branches',
          key: 'id'
        }
      }
    }, {
      timestamps: false
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('BranchStocks');
  }
};
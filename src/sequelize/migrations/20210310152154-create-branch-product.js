'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('BranchProducts', {
      branchId: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Branches',
          key: 'id'
        }
      },
      productId: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Products',
          key: 'id'
        }
      },
      quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.BIGINT,
        defaultValue: new Date().getTime()
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.BIGINT,
        defaultValue: new Date().getTime()
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('BranchProducts');
  }
};
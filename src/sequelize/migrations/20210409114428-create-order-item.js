'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('OrderItems', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      orderId: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
          key: 'id',
          model: 'Orders'
        }
      },
      productId: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
          key: 'id',
          model: 'Products'
        }
      },
      productBranchId: {
        type: Sequelize.UUID,
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        references: {
          key: 'id',
          model: 'Branches'
        }
      },
      orderItemCostPrice: {
        type: Sequelize.DOUBLE,
        defaultValue: 0.0
      },
      orderItemSellingPrice: {
        type: Sequelize.DOUBLE,
        defaultValue: 0.0
      },
      quantityOrdered: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      }
    }, { timestamps: false });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('OrderItems');
  }
};
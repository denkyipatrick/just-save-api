'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('CompanyStockItems', {
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
          model: 'CompanyStocks',
          key: 'id'
        }
      },
      productId: {
        allowNull: false,
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
          model: 'Products',
          key: 'id'
        }
      },
      quantityStocked: {
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      quantityFromPreviousStock: {
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      quantitySold: {
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      availableQuantity: {
        defaultValue: 0,
        type: Sequelize.INTEGER
      }
    }, {
      timestamps: false
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('CompanyStockItems');
  }
};
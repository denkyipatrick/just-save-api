'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.renameTable('StockItems', 'StockEntryItems')
    .then(() => {
      return queryInterface.removeConstraint('StockEntryItems', 'stockitems_ibfk_1');
    })
    .then(() => {
      return queryInterface.addConstraint('StockEntryItems', {
        type: 'FOREIGN KEY',
        fields: ['productId'],
        name: 'stockentryitem_to_products_ibfk_1',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
          field: 'id',
          table: 'Products'
        }
      })
    })
     .then(() => {
       return queryInterface.removeConstraint('StockEntryItems', 'stockitems_ibfk_2');
     })
     .then(() => {
      return queryInterface.addConstraint('StockEntryItems', {
        type: 'FOREIGN KEY',
        fields: ['stockEntryId'],
        name: 'stockentryitem_to_stockentries_ibfk_1',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
          field: 'id',
          table: 'StockEntries'
        }
      });
    })
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.renameTable('StockEntryItems', 'StockItems')
    .then(() => {
      return queryInterface.removeConstraint('StockItems',
        'stockentryitem_to_products_ibfk_1');
    })
    .then(() => {
     return queryInterface.addConstraint('StockItems', {
        type: 'FOREIGN KEY',
        fields: ['stockEntryId'],
        name: 'stockitems_ibfk_2',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        references: {
          field: 'id',
          table: 'Products'
        }
      });
    })
    .then(() => {
      return queryInterface.removeConstraint('StockItems',
        'stockentryitem_to_stockentries_ibfk_1');
    })
    .then(() => {
     return queryInterface.addConstraint('StockItems', {
        type: 'FOREIGN KEY',
        fields: ['stockEntryId'],
        name: 'stockitems_ibfk_1',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
          field: 'id',
          table: 'StockEntries'
        }
      });
    })
  }
};

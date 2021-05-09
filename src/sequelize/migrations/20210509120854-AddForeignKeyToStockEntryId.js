'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
   return queryInterface.addConstraint('StockItems', {
      type: 'FOREIGN KEY',
      fields: ['stockEntryId'],
      name: 'stock_entry_stock_entry_items_fk',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      references: {
        field: 'id',
        table: 'StockEntries'
      }
   });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.removeConstraint(
      'StockItems',
      'stock_entry_stock_entry_items_fk'
    );
  }
};

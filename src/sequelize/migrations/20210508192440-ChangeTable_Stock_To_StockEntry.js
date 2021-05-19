'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
   return queryInterface.renameTable('Stocks', 'StockEntries')
   .then(() => {
     return queryInterface.removeConstraint('StockEntries', 'stocks_ibfk_1');
   })
   .then(() => {
    return queryInterface.addConstraint('StockEntries', {
      type: 'FOREIGN KEY',
      fields: ['branchId'],
      name: 'stockentry_to_branch_fk_1',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
      references: {
        field: 'id',
        table: 'Branches'
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
  return queryInterface.removeConstraint('StockEntries', 'stockentry_to_branch_fk_1')
   .then(() => {
      return queryInterface.renameTable('StockEntries', 'Stocks')
   })
   .then(() => {
    return queryInterface.addConstraint('Stocks', {
      type: 'FOREIGN KEY',
      fields: ['branchId'],
      name: 'stocks_ibfk_1',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
      references: {
        field: 'id',
        table: 'Branches'
      }
    });
   })
  }
};

'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
   return queryInterface.addColumn('Orders', 'stockId', {
     type: Sequelize.UUID,
     collate: 'utf8mb4_bin'
   })
   .then(() => {
    return queryInterface.addConstraint('Orders', {
      fields: ['stockId'],
      type: 'FOREIGN KEY',
      name: 'stock_to_orders_fk',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      references: {
        table: 'CompanyStocks',
        field: 'id'
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
   return queryInterface.removeColumn('Orders', 'stockId')
   .then(() => {
    return queryInterface.removeConstraint('Orders', 'stock_to_orders_fk')
   })
  }
};

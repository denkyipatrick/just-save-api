'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
   return queryInterface.sequelize.query(
     `ALTER TABLE StockItems change stockId stockEntryId char(36) collate utf8mb4_bin`
   );
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
   return queryInterface.sequelize.query(
    `ALTER TABLE StockItems change stockEntryId stockId char(36) collate utf8mb4_bin`
   );
  }
};

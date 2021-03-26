'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.addColumn('Products', 'costPrice', {
      type: Sequelize.DOUBLE(16, 5),
      defaultValue: 0.00,
    })
      .then(() => {
        return queryInterface.addColumn('Products', 'sellingPrice', {
          type: Sequelize.DOUBLE(16, 5),
          defaultValue: 0.00,
        });
      });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.removeColumn('Products', 'costPrice')
      .then(() => {
        return queryInterface.removeColumn('Products', 'sellingPrice');
      });
  },
};

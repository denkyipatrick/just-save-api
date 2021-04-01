'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        id: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert('Roles', [
      {
        id: 'edit-product',
        displayName: 'Edit Product Name & Quantity',
        group: 'product',
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
      },
      {
        id: 'edit-product-price',
        displayName: 'Edit Product Price',
        group: 'product',
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    return queryInterface.bulkDelete('Roles', null, {});
  },
};

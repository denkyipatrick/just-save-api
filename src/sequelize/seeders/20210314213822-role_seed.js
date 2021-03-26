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
       id: 'add-product',
       displayName: 'Add Product',
       group: 'product',
       createdAt: new Date().getTime(),
       updatedAt: new Date().getTime()
     },
     {
       id: 'delete-product',
       displayName: 'Delete Product',
       group: 'product',
       createdAt: new Date().getTime(),
       updatedAt: new Date().getTime()
     },
     {
       id: 'view-product',
       displayName: 'View Product',
       group: 'product',
       createdAt: new Date().getTime(),
       updatedAt: new Date().getTime()
     },
     {
       id: 'add-staff',
       displayName: 'Add Staff',
       group: 'staff',
       createdAt: new Date().getTime(),
       updatedAt: new Date().getTime()
     },
     {
       id: 'delete-staff',
       displayName: 'Delete Staff',
       group: 'staff',
       createdAt: new Date().getTime(),
       updatedAt: new Date().getTime()
     },
     {
       id: 'view-staff',
       displayName: 'View Staff',
       group: 'staff',
       createdAt: new Date().getTime(),
       updatedAt: new Date().getTime()
     },
     {
       id: 'view-dashboard',
       displayName: 'View Dashboard',
       group: 'system',
       createdAt: new Date().getTime(),
       updatedAt: new Date().getTime()
     },
     {
       id: 'make-order',
       displayName: 'Make Order',
       group: 'system',
       createdAt: new Date().getTime(),
       updatedAt: new Date().getTime()
     },
     {
       id: 'edit-staff-role',
       displayName: 'Edit Role',
       group: 'system',
       createdAt: new Date().getTime(),
       updatedAt: new Date().getTime()
     },
     {
       id: 'edit-staff-name',
       displayName: 'Edit Staff Name',
       group: 'staff',
       createdAt: new Date().getTime(),
       updatedAt: new Date().getTime()
     },    
    {
      id: 'view-branch',
      displayName: 'View Branch',
      group: 'branch',
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime()
    },
    {
      id: 'add-branch',
      displayName: 'Create Branch',
      group: 'branch',
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime()
    },
    {
      id: 'edit-branch',
      displayName: 'Edit Branch',
      group: 'branch',
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime()
    },
    {
      id: 'delete-branch',
      displayName: 'Delete Branch',
      group: 'branch',
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime()
    }
   ])
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
   return queryInterface.bulkDelete('Roles', null, {});
  }
};

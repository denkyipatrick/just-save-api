'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('StaffRoles', {
      staffUsername: {
        primaryKey: true,
        type: Sequelize.STRING,
      },
      roleId: {
        primaryKey: true,
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.BIGINT,
        defaultValue: new Date().getTime(),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.BIGINT,
        defaultValue: new Date().getTime(),
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('StaffRoles');
  },
};

'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('NewStaffRoles', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      staffId: {
        allowNull: false,
        type: Sequelize.UUID
      },
      roleId: {
        allowNull: false,
        type: Sequelize.STRING
      }
    }, { timestamps: false });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('NewStaffRoles');
  }
};
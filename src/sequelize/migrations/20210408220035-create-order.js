'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Orders', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      companyId: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
          key: 'id',
          model: 'Companies'
        }
      },
      branchId: {
        type: Sequelize.UUID,
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        references: {
          key: 'id',
          model: 'Branches'
        }
      },
      staffId: {
        type: Sequelize.UUID,
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        references: {
          key: 'id',
          model: 'NewStaffs'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Orders');
  }
};
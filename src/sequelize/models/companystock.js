'use strict';
module.exports = (sequelize, DataTypes) => {
  const CompanyStock = sequelize.define('CompanyStock', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    dateClosed: {
      type: DataTypes.DATE
    },
    isActive: {
      defaultValue: false,
      type: DataTypes.BOOLEAN
    },
    type: {
      type: DataTypes.ENUM,
      values: ['warehouse', 'branch']
    },
    companyId: {
      allowNull: false,
      type: DataTypes.UUID
    }
  }, {});
  CompanyStock.associate = function(models) {
    // associations can be defined here
    CompanyStock.hasOne(models.CompanyBranchStock, {
      as: 'branchStock',
      foreignKey: 'stockId'
    });

    CompanyStock.hasMany(models.CompanyStockItem, {
      as: 'items',
      foreignKey: 'stockId'
    });
  };
  return CompanyStock;
};
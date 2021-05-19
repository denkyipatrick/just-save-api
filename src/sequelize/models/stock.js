'use strict';
module.exports = (sequelize, DataTypes) => {
  const Stock = sequelize.define('Stock', {
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
  Stock.associate = function(models) {
    // associations can be defined here
    Stock.hasOne(models.BranchStock, {
      as: 'branchStock',
      foreignKey: 'stockId'
    });

    Stock.hasMany(models.StockItem, {
      as: 'items'
    });
  };
  return Stock;
};
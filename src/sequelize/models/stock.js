'use strict';
module.exports = (sequelize, DataTypes) => {
  const Stock = sequelize.define('Stock', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    branchId: {
      type: DataTypes.UUID
    },
    companyId: {
      type: DataTypes.UUID
    },
    isOpened: {
      defaultValue: false,
      type: DataTypes.BOOLEAN
    }
  }, {});
  Stock.associate = function(models) {
    // associations can be defined here
    Stock.hasMany(models.StockItem, {
      as: 'items'
    });

    Stock.belongsTo(models.Branch, {
      as: 'branch'
    });

    Stock.belongsTo(models.Company, {
      as: 'company'
    });
  };
  return Stock;
};
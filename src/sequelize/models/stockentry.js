'use strict';

module.exports = (sequelize, DataTypes) => {
  const StockEntry = sequelize.define('StockEntry', {
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
  StockEntry.associate = function(models) {
    // associations can be defined here
    StockEntry.hasMany(models.StockEntryItem, {
      as: 'items'
    });

    StockEntry.belongsTo(models.Branch, {
      as: 'branch'
    });

    StockEntry.belongsTo(models.Company, {
      as: 'company'
    });
  };
  return StockEntry;
};
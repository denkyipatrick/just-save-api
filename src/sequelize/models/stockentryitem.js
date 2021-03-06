'use strict';
module.exports = (sequelize, DataTypes) => {
  const StockEntryItem = sequelize.define('StockEntryItem', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    productId: {
      type: DataTypes.UUID
    },
    stockEntryId: {
      type: DataTypes.UUID
    },
    quantity: {
      defaultValue: 0,
      type: DataTypes.INTEGER
    },
    availableQuantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    timestamps: false
  });
  StockEntryItem.associate = function(models) {
    // associations can be defined here
    StockEntryItem.belongsTo(models.Product, {
      as: 'product'
    });

    StockEntryItem.belongsTo(models.StockEntry, {
      as: 'stockEntry',
      foreignKey: 'stockEntryId'
    });
  };
  return StockEntryItem;
};
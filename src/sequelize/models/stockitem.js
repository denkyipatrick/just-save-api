'use strict';
module.exports = (sequelize, DataTypes) => {
  const StockItem = sequelize.define('StockItem', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    productId: {
      type: DataTypes.UUID
    },
    stockId: {
      type: DataTypes.UUID
    },
    quantity: {
      type: DataTypes.INTEGER
    },
    availableQuantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {});
  StockItem.associate = function(models) {
    // associations can be defined here
    StockItem.belongsTo(models.Product, {
      as: 'product'
    });

    StockItem.belongsTo(models.Stock, {
      as: 'stock'
    });
  };
  return StockItem;
};
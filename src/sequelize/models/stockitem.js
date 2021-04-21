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
    }
  }, {});
  StockItem.associate = function(models) {
    // associations can be defined here
  };
  return StockItem;
};
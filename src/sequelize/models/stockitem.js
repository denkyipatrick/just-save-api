'use strict';
module.exports = (sequelize, DataTypes) => {
  const StockItem = sequelize.define('StockItem', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    stockId: {
      allowNull: false,
      type: DataTypes.UUID
    },
    productId: {
      allowNull: false,
      type: DataTypes.UUID
    },
    quantityStocked: {
      defaultValue: 0,
      type: DataTypes.INTEGER
    },
    quantityFromPreviousStock: {
      defaultValue: 0,
      type: DataTypes.INTEGER
    },
    quantitySold: {
      defaultValue: 0,
      type: DataTypes.INTEGER
    },
    availableQuantity: {
      defaultValue: 0,
      type: DataTypes.INTEGER
    }
  }, {
    timestamps: false
  });
  StockItem.associate = function(models) {
    // associations can be defined here
    StockItem.belongsTo(models.Product, {
      as: 'product'
    });
  };
  return StockItem;
};
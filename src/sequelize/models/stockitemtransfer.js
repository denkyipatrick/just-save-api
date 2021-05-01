'use strict';
module.exports = (sequelize, DataTypes) => {
  const StockItemTransfer = sequelize.define('StockItemTransfer', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    sendingStockItemId: {
      type: DataTypes.UUID
    },
    receivingStockItemId: {
      type: DataTypes.UUID
    },
    receivingStockId: {
      type: DataTypes.UUID
    },
    quantity: {
      defaultValue: 0,
      type: DataTypes.INTEGER
    },
    senderUsername: {
      type: DataTypes.UUID
    }
  }, {});
  StockItemTransfer.associate = function(models) {
    // associations can be defined here
  };
  return StockItemTransfer;
};
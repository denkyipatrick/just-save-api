'use strict';
module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define('OrderItem', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    orderId: {
      allowNull: false,
      type: DataTypes.UUID
    },
    productId: {
      type: DataTypes.UUID
    },
    productBranchId: {
      type: DataTypes.UUID
    },
    orderItemCostPrice: {
      type: DataTypes.DOUBLE,
      defaultValue: 0.0
    },
    orderItemSellingPrice: {
      type: DataTypes.DOUBLE,
      defaultValue: 0.0
    },
    salePrice: {
      defaultValue: 0.0,
      type: DataTypes.DOUBLE(10, 4)
    },
    quantityOrdered: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, { timestamps: false });
  OrderItem.associate = function(models) {
    // associations can be defined here
    OrderItem.belongsTo(models.Product, {
      as: 'product',
      foreignKey: 'productId'
    });
  };
  return OrderItem;
};
'use strict';
module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define('OrderItem', {
    orderId: DataTypes.UUID,
    productId: DataTypes.UUID,
    orderCostPrice: DataTypes.DOUBLE,
    orderSellingPrice: DataTypes.DOUBLE,
    quantityOrdered: DataTypes.INTEGER
  }, {});
  OrderItem.associate = function(models) {
    // associations can be defined here
  };
  return OrderItem;
};
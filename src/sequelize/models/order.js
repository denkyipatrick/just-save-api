'use strict';
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
  id: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4
  },
  companyId: {
    type: DataTypes.UUID
  }
  }, {});
  Order.associate = function(models) {
    // associations can be defined here
  };
  return Order;
};
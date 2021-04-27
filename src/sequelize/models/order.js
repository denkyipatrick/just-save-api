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
  },
  staffId: {
    type: DataTypes.UUID
  },
  branchId: {
    type: DataTypes.UUID
  },
  }, {});
  Order.associate = function(models) {
    // associations can be defined here
    Order.belongsTo(models.NewStaff, {
      as: 'staff',
      foreignKey: 'staffId'
    });

    Order.belongsTo(models.Branch, {
      as: 'branch'
    });

    Order.hasMany(models.OrderItem, {
      as: 'items',
      foreignKey: 'orderId'
    });
  };
  return Order;
};
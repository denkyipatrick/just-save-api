'use strict';
module.exports = (sequelize, DataTypes) => {
  const Stock = sequelize.define('Stock', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    branchId: {
      type: DataTypes.UUID
    },
    isOpened: {
      defaultValue: false,
      type: DataTypes.BOOLEAN
    }
  }, {});
  Stock.associate = function(models) {
    // associations can be defined here
  };
  return Stock;
};
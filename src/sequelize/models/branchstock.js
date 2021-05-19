'use strict';
module.exports = (sequelize, DataTypes) => {
  const BranchStock = sequelize.define('BranchStock', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    stockId: {
      allowNull: false,
      type: DataTypes.UUID
    },
    branchId: {
      allowNull: false,
      type: DataTypes.UUID
    }
  }, {
    timestamps: false
  });
  BranchStock.associate = function(models) {
    // associations can be defined here
    BranchStock.belongsTo(models.Stock, {
      as: 'stock',
      foreignKey: 'stockId'
    });

    BranchStock.belongsTo(models.Branch, {
      as: 'branch',
      foreignKey: 'branchId'
    });
  };
  return BranchStock;
};
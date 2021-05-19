'use strict';
module.exports = (sequelize, DataTypes) => {
  const CompanyBranchStock = sequelize.define('CompanyBranchStock', {
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
  CompanyBranchStock.associate = function(models) {
    // associations can be defined here
    CompanyBranchStock.belongsTo(models.CompanyStock, {
      as: 'stock',
      foreignKey: 'stockId'
    });

    CompanyBranchStock.belongsTo(models.Branch, {
      as: 'branch',
      foreignKey: 'branchId'
    });
  };
  return CompanyBranchStock;
};
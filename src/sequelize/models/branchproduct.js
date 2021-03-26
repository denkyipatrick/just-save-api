'use strict';
module.exports = (sequelize, DataTypes) => {
  const BranchProduct = sequelize.define('BranchProduct', {
    branchId: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.STRING
    },
    productId: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.STRING
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.BIGINT,
      defaultValue: new Date().getTime()
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.BIGINT,
      defaultValue: new Date().getTime()
    }
  }, {});
  BranchProduct.associate = function(models) {
    // associations can be defined here
    BranchProduct.belongsTo(models.Branch, {
      as: 'branch',
      foreignKey: 'branchId'
    });
  };
  return BranchProduct;
};
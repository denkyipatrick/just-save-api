'use strict';
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    lookupKey: {
      unique: true,
      allowNull: false,
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    unitPrice: {
      type: DataTypes.DOUBLE(10, 2),
    },
    costPrice: {
      type: DataTypes.DOUBLE(16, 5),
    },
    sellingPrice: {
      type: DataTypes.DOUBLE(16, 5),
    },
    companyId: {
      type: DataTypes.UUID,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.BIGINT,
      defaultValue: new Date().getTime(),
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.BIGINT,
      defaultValue: new Date().getTime(),
    },
  }, {});
  Product.associate = function(models) {
    // associations can be defined here
    Product.belongsToMany(models.Branch, {
      as: 'branches',
      through: models.BranchProduct,
    });

    Product.belongsTo(models.Company, {
      as: 'company',
      foreignKey: 'companyId'
    });

    Product.hasMany(models.BranchProduct, {
      as: 'productBranches',
      foreignKey: 'productId',
    });
  };
  return Product;
};

'use strict';
module.exports = (sequelize, DataTypes) => {
  const Staff = sequelize.define('Staff', {
    username: {
      primaryKey: true,
      type: DataTypes.STRING,
    },
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    branchId: {
      type: DataTypes.UUID,
    },
    password: {
      type: DataTypes.STRING,
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
  Staff.associate = function(models) {
    // associations can be defined here
    Staff.belongsTo(models.Branch, {
      as: 'branch',
      foreignKey: 'branchId',
    });

    Staff.belongsToMany(models.Role, {
      as: 'roles',
      through: models.StaffRole,
    });

    // Staff.hasMany(models.StaffRole, {
    //   as: 'roles',
    //   foreignKey: 'staffUsername'
    // });
  };
  return Staff;
};

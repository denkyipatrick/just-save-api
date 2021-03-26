'use strict';
module.exports = (sequelize, DataTypes) => {
  const StaffRole = sequelize.define('StaffRole', {
    staffUsername: {
      primaryKey: true,
      type: DataTypes.STRING,
    },
    roleId: {
      primaryKey: true,
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
  StaffRole.associate = function(models) {
    // associations can be defined here

  };
  return StaffRole;
};

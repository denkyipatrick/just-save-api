'use strict';
module.exports = (sequelize, DataTypes) => {
  const StaffRole = sequelize.define('StaffRole', {
    staffId: {
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
    // StaffRole.belongsTo(models.NewStaff, {
    //   as: 'staff',
    //   foreignKey: 'staffId'
    // });
  };
  return StaffRole;
};

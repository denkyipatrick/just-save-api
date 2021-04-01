'use strict';
module.exports = (sequelize, DataTypes) => {
  const StaffBranch = sequelize.define('StaffBranch', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    branchId: {
      allowNull: false,
      type: DataTypes.UUID
    },
    staffId: {
      allowNull: false,
      type: DataTypes.UUID
    },
  }, {});
  StaffBranch.associate = function(models) {
    // associations can be defined here
  };
  return StaffBranch;
};
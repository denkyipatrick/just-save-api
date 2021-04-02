'use strict';
module.exports = (sequelize, DataTypes) => {
  const NewStaffRole = sequelize.define('NewStaffRole', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    staffId: {
      allowNull: false,
      type: DataTypes.UUID
    },
    roleId: {
      allowNull: false,
      type: DataTypes.STRING
    },
  }, { timestamps: false });
  NewStaffRole.associate = function(models) {
    // associations can be defined here
    NewStaffRole.belongsTo(models.Role, {
      as: 'role',
      foreignKey: 'roleId'
    });
  };
  return NewStaffRole;
};
'use strict';
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    displayName: {
      type: DataTypes.STRING
    },
    group: {
      type: DataTypes.STRING
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
  Role.associate = function(models) {
    // associations can be defined here
  };
  return Role;
};
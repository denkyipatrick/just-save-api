'use strict';
module.exports = (sequelize, DataTypes) => {
  const NewStaff = sequelize.define('NewStaff', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    username: {
      type: DataTypes.STRING,
    },
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
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
  NewStaff.associate = function(models) {
    // associations can be defined here
    NewStaff.belongsTo(models.Company, {
      as: 'company',
      foreignKey: 'companyId',
    });

    NewStaff.hasOne(models.StaffBranch, {
      as: 'staffBranch',
      foreignKey: 'staffId'
    });

    NewStaff.belongsToMany(models.Role, {
      as: 'roles',
      foreignKey: 'staffId',
      otherKey: 'roleId',
      through: models.NewStaffRole,
    });
  };
  return NewStaff;
};

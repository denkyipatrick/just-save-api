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
  NewStaff.associate = function(models) {
    // associations can be defined here
    NewStaff.belongsTo(models.Company, {
      as: 'company',
      foreignKey: 'companyId',
    });

    NewStaff.hasOne(models.StaffBranch, {
      as: 'branch',
      foreignKey: 'staffId'
    });

    NewStaff.belongsToMany(models.Role, {
      as: 'roles',
      through: models.StaffRole,
    });
  };
  return NewStaff;
};

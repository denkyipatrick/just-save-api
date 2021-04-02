'use strict';

const BASE_URL = process.env.BASE_URL;
const STAFF_ROLES_URL = `${BASE_URL}/staffroles`;
const { NewStaffRole, StaffRole, Role } = require('../sequelize/models/index');

module.exports = app => {
  app.post(`${STAFF_ROLES_URL}`, async(req, res) => {
    console.log(req.body);
    try {
      await NewStaffRole.create({
        roleId: req.body.roleId,
        staffId: req.body.staffId,
      });

      const role = await Role.findByPk(req.body.roleId);
      res.status(201).send(role);
    } catch (error) {
      res.sendStatus(500);
      console.error(error);
    }
  });

  app.delete(`${STAFF_ROLES_URL}/:staffRoleId`, async(req, res) => {
    console.log(req.params);
    try {

      const newStaffRole = await NewStaffRole.findByPk(req.params.staffRoleId, {
        include: ['role']
      });

      await NewStaffRole.destroy({
        where: {
          id: req.params.staffRoleId
        },
      });

      res.send(newStaffRole.role);
    } catch (error) {
      res.sendStatus(500);
      console.error(error);
    }
  });
};

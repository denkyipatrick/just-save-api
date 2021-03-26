'use strict';

const BASE_URL = process.env.BASE_URL;
const STAFF_ROLES_URL = `${BASE_URL}/staffroles`;
const { StaffRole, Role } = require('../sequelize/models/index');

module.exports = app => {
  app.post(`${STAFF_ROLES_URL}`, async(req, res) => {
    console.log(req.body);
    try {
      await StaffRole.create({
        roleId: req.body.roleId,
        staffUsername: req.body.staffUsername,
      });

      const role = await Role.findByPk(req.body.roleId);
      res.status(201).send(role);
    } catch (error) {
      res.sendStatus(500);
      console.error(error);
    }
  });

  app.delete(`${STAFF_ROLES_URL}/:staffUsername/:roleId`, async(req, res) => {
    console.log(req.params);
    try {
      await StaffRole.destroy({
        where: {
          roleId: req.params.roleId,
          staffUsername: req.params.staffUsername,
        },
      });

      const role = await Role.findByPk(req.params.roleId);
      res.send(role);
    } catch (error) {
      res.sendStatus(500);
      console.error(error);
    }
  });
};

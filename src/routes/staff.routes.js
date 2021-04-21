'use strict';

const BASE_URL = process.env.BASE_URL;
const STAFF_URL = `${BASE_URL}/staff`;
const bcryptjs = require('bcryptjs');
const { Branch, Staff, NewStaff, StaffBranch, sequelize, Role, StaffRole } =
    require('../sequelize/models/index');

const controllers = require('../controllers/index');

module.exports = app => {
  app.get(`${STAFF_URL}`, async(req, res) => {
    try {
      const staffList = await NewStaff.findAll({
        order: [['firstName', 'ASC'], ['lastName', 'ASC']],
        include: [
          'roles',
          { model: StaffBranch, as: 'staffBranch', include: ['branch'] }
        ]
      });

      res.send(staffList);
    } catch (error) {
      res.sendStatus(500);
      console.error(error);
    }
  });

  app.get(`${STAFF_URL}/:id`, async(req, res) => {
    try {
      const staff = await NewStaff.findByPk(req.params.id, {
        order: [['firstName', 'ASC'], ['lastName', 'ASC']],
        include: [
          'roles',
          { model: StaffBranch, as: 'staffBranch', include: ['branch'] }
        ],
      });

      res.send(staff);
    } catch (error) {
      res.sendStatus(500);
      console.error(error);
    }
  });

  app.post(`${STAFF_URL}`, controllers.CreateStaffController.create)

  app.post(`${STAFF_URL}/lskd/sldfk`, async(req, res) => {
    console.log(req.body);
    const sequelizeTransaction = await sequelize.transaction();

    try {
      const staff = await Staff.create({
        branchId: req.body.branchId,
        lastName: req.body.lastName,
        username: req.body.username,
        firstName: req.body.firstName,
        password: bcryptjs.hashSync(req.body.password, 10),
      }, { transaction: sequelizeTransaction });

      await StaffRole.create({
        staffUsername: staff.username,
        roleId: 'view-product',
      }, { transaction: sequelizeTransaction });

      res.status(201).send(staff);
      sequelizeTransaction.commit();
    } catch (error) {
      sequelizeTransaction.rollback();
      res.sendStatus(500);
      console.error(error);
    }
  });

  app.post(`${STAFF_URL}/root`, async(req, res) => {
    const sequelizeTransaction = await sequelize.transaction();

    try {
      const staff = await NewStaff.create({
        companyId: req.body.companyId,
        lastName: 'Root',
        username: 'root',
        firstName: 'Root',
        password: bcryptjs.hashSync('root', 10),
      }, { transaction: sequelizeTransaction });

      const roles = await Role.findAll({
        attributes: ['id'],
        transaction: sequelizeTransaction,
      });

      await NewStaffRole.destroy({
        where: {
          staffId: staff.id,
        },
        transaction: sequelizeTransaction,
      });

      const newRoles = roles.map(role => {
        return {roleId: role.id, staffId: staff.id };
      });

      await NewStaffRole.bulkCreate(newRoles,
        { transaction: sequelizeTransaction });

      res.status(201).send(staff);
      sequelizeTransaction.commit();
    } catch (error) {
      sequelizeTransaction.rollback();
      res.sendStatus(500);
      console.error(error);
    }
  });

  app.post(`${STAFF_URL}/auth`, async(req, res) => {
    console.log(req.body);
    try {
      const staff = await NewStaff.findOne({
        where: {
          username: req.body.username,
          companyId: req.body.companyId
        },
        include: [
          'roles',
          { model: StaffBranch, as: 'staffBranch',
            include: [
              { model: Branch, as: 'branch', include: ['company'] }
            ]
          },
        ],
      });

      if (!staff || !bcryptjs.compareSync(req.body.password, staff.password)) {
        return res.status(404).send();
      }

      res.send(staff);
    } catch (error) {
      res.sendStatus(500);
      console.error(error);
    }
  });

  app.put(`${STAFF_URL}/:staffId/change-name`, async(req, res) => {
    try {
      const staff = await NewStaff.update({
        lastName: req.body.lastName,
        firstName: req.body.firstName,
      }, {
        where: {
          id: req.params.staffId,
        },
      })
        .then(() => Staff.findByPk(req.params.staffId));

      res.send(staff);
    } catch (error) {
      res.sendStatus(500);
      console.error(error);
    }
  });

  app.put(`${STAFF_URL}/:username/set-all-roles`, async(req, res) => {
    let sequelizeTransaction = await sequelize.transaction();
    try {
      const roles = await Role.findAll({
        attributes: ['id'],
        transaction: sequelizeTransaction,
      });

      await StaffRole.destroy({
        where: {
          staffUsername: req.params.username,
        },
        transaction: sequelizeTransaction,
      });

      const newRoles = roles.map(role => {
        return {roleId: role.id, staffUsername: req.params.username };
      });

      await StaffRole.bulkCreate(newRoles,
        { transaction: sequelizeTransaction });

      const staff = await Staff.findByPk(req.params.username, {
        include: ['roles'],
      });

      res.send(staff);
      sequelizeTransaction.commit();
    } catch (error) {
      sequelizeTransaction.rollback();
      res.sendStatus(500);
      console.error(error);
    }
  });

  app.put(`${STAFF_URL}/:username/change-password`, async(req, res) => {
    try {
      const staff = await Staff.update({
        password: bcryptjs.hashSync(req.body.newPassword, 10),
      }, {
        where: {
          username: req.params.username,
        },
      })
        .then(() => Staff.findByPk(req.params.username));

      res.send(staff);
    } catch (error) {
      res.sendStatus(500);
      console.error(error);
    }
  });
};

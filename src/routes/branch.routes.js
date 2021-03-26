'use strict';

const BASE_URL = process.env.BASE_URL;
const BRANCHES_URL = `${BASE_URL}/branches`;
const { Branch, Product, Staff } = require('../sequelize/models/index');

module.exports = app => {
  app.get(`${BRANCHES_URL}`, async(req, res) => {
    try {
      res.send(await Branch.findAll({
        order: [['name', 'ASC']],
      }));
    } catch (error) {
      res.sendStatus(500);
      console.error(error);
    }
  });

  app.get(`${BRANCHES_URL}/:branchId/staffs`, async(req, res) => {
    console.log(req.params);
    try {
      const staffList = await Staff.findAll({
        order: [['firstName', 'ASC'], ['lastName', 'ASC']],
        include: ['roles'],
        where: {
          branchId: req.params.branchId,
        },
      });

      res.send(staffList);
    } catch (error) {
      res.sendStatus(500);
      console.error(error);
    }
  });

  app.get(`${BRANCHES_URL}/:branchId/products`, async(req, res) => {
    console.log(req.query);

    try {
      const products = await Product.findAll({
        order: [['name', 'ASC']],
        where: { '$productBranches.branchId$': req.params.branchId },
        include: ['productBranches'],
      });

      res.send(products);
    } catch (error) {
      res.sendStatus(500);
      console.error(error);
    }
  });

  app.post(`${BRANCHES_URL}`, async(req, res) => {
    console.log(req.body);
    try {
      const branch = await Branch.create({
        name: req.body.name,
        address: req.body.address,
        companyId: req.body.companyId,
      });

      res.send(branch);
    } catch (error) {
      res.sendStatus(500);
      console.error(error);
    }
  });
};

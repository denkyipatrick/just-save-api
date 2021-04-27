'use strict';

// Created: 22 Mar 2021
const COMPANIES_URL = `${process.env.BASE_URL}/companies`;
const { Company, Branch, StaffBranch, Product, BranchProduct, NewStaff, Sequelize } =
    require('../sequelize/models/index');

const controllers = require('../controllers/index');

module.exports = app => {
  app.get(COMPANIES_URL, async(req, res) => {
    try {
      const companies = await Company.findAll({
        order: [['name', 'ASC']],
      });
      res.send(companies);
    } catch (error) {
      res.sendStatus(500);
      console.error(error);
    }
  });

  app.get(`${COMPANIES_URL}/:id`, async(req, res) => {
    try {
      const company = await Company.findOne({
        where: {
          [Sequelize.Op.or]: [
            { id: req.params.id },
            { publicId: req.params.id },
          ],
        },
      });

      if (!company) {
        return res.sendStatus(404);
      }
      res.send(company);
    } catch (error) {
      res.sendStatus(500);
      console.error(error);
    }
  });

  app.get(`${COMPANIES_URL}/:companyId/stocks`, controllers.StockController.fetchCompanyStocks);
  app.get(`${COMPANIES_URL}/:companyId/orders`, controllers.OrderController.fetchCompanyOrders);

  app.get(`${COMPANIES_URL}/:id/branches`, async(req, res) => {
    console.log(req.params);

    try {
      const branches = await Branch.findAll({
        where: {
          companyId: req.params.id,
        },
        order: [['name', 'ASC']],
      });

      res.send(branches);
    } catch (error) {
      res.sendStatus(500);
      console.error(error);
    }
  });

  app.get(`${COMPANIES_URL}/:id/products`, async(req, res) => {
    console.log(req.params);

    try {
      const products = await Product.findAll({
        where: {
          companyId: req.params.id,
        },
        order: [['name', 'ASC']],
        include: [
          { model: BranchProduct, as: 'productBranches', include: ['branch'] },
        ],
      });

      res.send(products);
    } catch (error) {
      res.sendStatus(500);
      console.error(error);
    }
  });

  app.get(`${COMPANIES_URL}/:id/staffs`,  async(req, res) => {

    try {
      const staffs = await NewStaff.findAll({
        where: {
          companyId: req.params.id
        },
        include: [
          {model: StaffBranch, as: 'staffBranch', include: ['branch'] }]
      });

      res.send(staffs);
    } catch (error) {
      res.sendStatus(500);
      console.error(error);
    }
  });

  app.get(`${COMPANIES_URL}/:id/products/lookup/:key`, async (req, res) => {
    console.log(req.params);

    try {
      const products = await Product.findAll({
        order: [['name', 'ASC']],
        where: {
          companyId: req.params.id,
          lookupKey: {
            [Sequelize.Op.like]: `${req.params.key}%`,
          },
        },
      });

      console.log(products.length);

      res.send(products);
    } catch (error) {
      res.sendStatus(500);
      console.error(error);
    }
  })

  app.get(`${COMPANIES_URL}/:companyId/branches/:branchId/products`, async(req, res) => {
    console.log(req.params);
    try {
      const products = await Product.findAll({
        order: [['name', 'ASC']],
        where: { '$productBranches.branchId': req.params.branchId},
        include: [
          { model: BranchProduct, as: 'productBranches', include: ['branch'] },
        ],
      });

      res.send(products);
    } catch (error) {
      res.sendStatus(500);
      console.error(error);
    }
  });

  app.post(COMPANIES_URL, async(req, res) => {
    try {
      const company = await Company.create({
        name: req.body.name,
        publicId: req.body.publicId,
      });

      res.status(201).send(company);
    } catch (error) {
      res.sendStatus(500);
      console.error(error);
    }
  });
};

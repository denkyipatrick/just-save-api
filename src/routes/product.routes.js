'use strict';

const BASE_URL = process.env.BASE_URL;
const PRODUCTS_URL = `${BASE_URL}/products`;
const controllers = require('../controllers/index');
const { Product, Branch, BranchProduct, Sequelize, sequelize } = require('../sequelize/models/index');

module.exports = app => {
  app.put(`${PRODUCTS_URL}/:productId/change-name`,
    controllers.UpdateProductNameController.changeName);

  app.put(`${PRODUCTS_URL}/:productId/change-price`,
  controllers.UpdateProductPriceController.changePrice);

  app.get(`${PRODUCTS_URL}`, async(req, res) => {
    try {
      const products = await Product.findAll({
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

  app.get(`${PRODUCTS_URL}/lookup/:key`, async(req, res) => {
    console.log(req.params);

    try {
      const products = await Product.findAll({
        order: [['name', 'ASC']],
        where: {
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
  });

  app.get(`${PRODUCTS_URL}/:id`, async(req, res) => {
    try {
      const product = await Product.findByPk(req.params.id, {
        include: [
          { model: BranchProduct, as: 'productBranches', include: ['branch'] },
        ],
      });

      res.send(product);
    } catch (error) {
      res.sendStatus(500);
      console.error(error);
    }
  });

  app.post(`${PRODUCTS_URL}`, controllers.ProductController.createProduct);
};

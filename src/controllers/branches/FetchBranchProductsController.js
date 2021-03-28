'use strict';

const { Product } = require('../../sequelize/models/index');

module.exports = class FetchBranchProductsController {
  static async fetchAllProducts(req, res) {
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
  }
};

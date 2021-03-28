'use strict';

const { Product } = require('../../sequelize/models/index');

module.exports = class UpdateProductNameController {
  static async changeName(req, res) {
    try {
      const product = await Product.update({
        name: req.body.name
      }, {
        where: { id: req.params.productId }
      })
      .then(() => Product.findByPk(req.params.productId));

      res.send(product);
    } catch (error) {
      res.sendStatus(500);
      console.error(error);
    }
  }
};

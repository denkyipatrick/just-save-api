'use strict';

const { Product } = require('../../sequelize/models/index');
module.exports = class UpdateProductNameController {
  static async changePrice(req, res) {
    try {
      const product = await Product.update({
        costPrice: +req.body.costPrice,
        sellingPrice: +req.body.sellingPrice
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

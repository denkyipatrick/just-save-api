'use strict';

const { Product, Branch, BranchProduct, Sequelize, sequelize } = require('../../sequelize/models/index');

module.exports = class UpdateBranchProductController {
  static async updateQuantity(req, res) {
    const sequelizeTransaction = await sequelize.transaction();
    try {
      req.body.newQuantity = +req.body.newQuantity;

      const branchProduct = await BranchProduct.findOne({
        transaction: sequelizeTransaction,
        where: {
          branchId: req.body.branchId,
          productId: req.body.productId
        },
        include: [
          { model: Branch, as: 'branch' },
          { model: Product, as: 'product', include: ['company'] }
        ]
      });

      const updateType = +req.body.newQuantity > branchProduct.quantity ?
        'add' : 'subtract';

      const newQuantity = updateType == 'add' ?
        req.body.newQuantity - branchProduct.quantity :
        branchProduct.quantity - req.body.newQuantity;

      await BranchProduct.update({
        quantity: updateType == 'add' ?
          Sequelize.literal(`quantity + ${newQuantity}`) :
          Sequelize.literal(`quantity - ${newQuantity}`)
      }, {
        transaction: sequelizeTransaction,
        where: {
          branchId: req.body.branchId,
          productId: req.body.productId
        }
      });

      await Product.update({
        quantity: updateType == 'add' ?
          Sequelize.literal(`quantity + ${newQuantity}`) :
          Sequelize.literal(`quantity - ${newQuantity}`)
      }, {
        transaction: sequelizeTransaction,
        where: {
          id: req.body.productId
        }
      });

      if (updateType == 'add') {
        branchProduct.quantity += newQuantity;
      } else {
        branchProduct.quantity -= newQuantity;
      }

      sequelizeTransaction.commit();
      res.send(branchProduct);
    } catch (error) {
      sequelizeTransaction.rollback();
      res.sendStatus(500);
      console.error(error);
    }
  }
};

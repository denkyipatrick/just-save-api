'use strict';

const {
  Order,
  Branch,
  Product,
  NewStaff,
  CompanyStockItem,
  BranchProduct,
  OrderItem,
  sequelize,
  Sequelize
} = require('../../sequelize/models/index');

const { validationResult } = require('express-validator');

module.exports = class CreateOrderController {
  static async create(req, res) {
    const sequelizeTransaction = await sequelize.transaction();

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).send(errors);
    }

    try {
      // let someItemsAreInsufficient = false;
      // let insufficientQuantityErrorMessages = [];

      // console.log(req.body.items);

      const stockItems = await CompanyStockItem.findAll({
        where: {
          id: req.body.items.map(item => item.stockItemId)
        },
        include: ['product'],
        transaction: sequelizeTransaction
      });

      const staff = await NewStaff.findByPk(req.body.staffId,{
        transaction: sequelizeTransaction,
        attributes: ['username'],
        include: [
          'staffBranch'
        ]
      });

      let order = await Order.create({
        stockId: req.body.stockId,
        staffId: req.body.staffId,
        companyId: req.body.companyId,
        branchId: staff.staffBranch.branchId
      }, { transaction: sequelizeTransaction });

      const cartItems = req.body.items.map(item => {
        const stockItem = stockItems.find(stockItem => stockItem.id === item.stockItemId);

        return {
          orderId: order.id,
          salePrice: +item.soldPrice,
          quantityOrdered: +item.quantity,
          productId: stockItem.product.id,
          // productBranchId: item.stockItem.branchId,
          orderItemCostPrice: +stockItem.product.costPrice,
          orderItemSellingPrice: +stockItem.product.sellingPrice
        }
      });

      await OrderItem.bulkCreate(cartItems, {
        transaction: sequelizeTransaction
      });

      stockItems.forEach(stockItem => {
        const cartItem = req.body.items.find(item => item.stockItemId === stockItem.id);

        CompanyStockItem.update({
          quantitySold: Sequelize.literal(`quantitySold + ${cartItem.quantity}`),
          availableQuantity: Sequelize.literal(`availableQuantity - ${cartItem.quantity}`)
        }, {
          where: {
            id: stockItem.id
          },
          transaction: sequelizeTransaction
        });
      });

      order = await Order.findByPk(order.id, {
        transaction: sequelizeTransaction,
        include: [
          { model: NewStaff, as: 'staff' },
          { model: Branch, as: 'branch' },
          { model: OrderItem, as: 'items', include: ['product'] }
        ]
      });

      // order.setDataValue('items', orderItems);
      sequelizeTransaction.commit();
      // sequelizeTransaction.rollback();
      res.status(201).send(order);
    } catch (error) {
      sequelizeTransaction.rollback();
      res.sendStatus(500);
      console.error(error);
    }
  }
};

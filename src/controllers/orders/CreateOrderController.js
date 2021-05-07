'use strict';

const {
  Order,
  Product,
  NewStaff,
  BranchProduct,
  OrderItem,
  sequelize,
  Sequelize
} = require('../../sequelize/models/index');

module.exports = class CreateOrderController {
  static async create(req, res) {
    const sequelizeTransaction = await sequelize.transaction();
    try {
      let someItemsAreInsufficient = false;
      let insufficientQuantityErrorMessages = [];

      for (const item of req.body.items) {
        const branchProduct = await BranchProduct.findOne({
          transaction: sequelizeTransaction,
          where: {
            branchId: item.branchProduct.branchId,
            productId: item.branchProduct.productId
          },
          include: ['product']
        });

        if (branchProduct.quantity < item.quantity) {
          someItemsAreInsufficient = true;
          const errorMessage = {
            productName: branchProduct.product.name,
            availableQuantity: branchProduct.quantity
          }

          insufficientQuantityErrorMessages.push(errorMessage)
        }
      }

      if (someItemsAreInsufficient) {
        res.status(400).send({items: JSON.stringify(insufficientQuantityErrorMessages)});
        sequelizeTransaction.rollback();
        return;
      }

      const staff = await NewStaff.findByPk(req.body.staffId,{
        transaction: sequelizeTransaction,
        attributes: ['username'],
        include: [
          'staffBranch'
        ]
      });

      let order = await Order.create({
        staffId: req.body.staffId,
        companyId: req.body.companyId,
        branchId: staff.staffBranch.branchId
      }, { transaction: sequelizeTransaction });

      const cartItems = req.body.items.map(item => {
        return {
          orderId: order.id,
          salePrice: +item.soldPrice,
          quantityOrdered: +item.quantity,
          productId: item.branchProduct.product.id,
          productBranchId: item.branchProduct.branchId,
          orderItemCostPrice: +item.branchProduct.product.costPrice,
          orderItemSellingPrice: +item.branchProduct.product.sellingPrice
        }
      });

      const orderedItems = await OrderItem.bulkCreate(cartItems, {
        transaction: sequelizeTransaction
      });

      for(const orderedItem of orderedItems) {
        await BranchProduct.update({
          quantity: Sequelize.literal(`quantity - ` +
          `${orderedItem.quantityOrdered}`)
        }, {
          transaction: sequelizeTransaction,
          where: {
            productId: orderedItem.productId,
            branchId: orderedItem.productBranchId
          }
        });

        await Product.update({
          quantity: Sequelize.literal(`quantity - ` +
          `${orderedItem.quantityOrdered}`)
        }, {
          transaction: sequelizeTransaction,
          where: {
            id: orderedItem.productId
          }
        });
      }

      const orderItems = await OrderItem.findAll({
        transaction: sequelizeTransaction,
        where: {
          id: { [Sequelize.Op.in]: orderedItems.map(item => item.id) }
        },
        include: ['product']
      });

      order = await Order.findByPk(order.id, {
        transaction: sequelizeTransaction,
        include: [
          { model: NewStaff, as: 'staff' },
          { model: OrderItem, as: 'items', include: ['product'] }
        ]
      });

      order.setDataValue('items', orderItems);
      sequelizeTransaction.commit();
      res.status(201).send(order);
    } catch (error) {
      sequelizeTransaction.rollback();
      res.sendStatus(500);
      console.error(error);
    }
  }
};

'use strict';

const { validationResult } = require('express-validator');

const {
  Stock,
  Branch,
  Product,
  sequelize,
  Sequelize,
  StockItem,
  BranchProduct,
  StockItemTransfer
} = require('../../sequelize/models/index');

module.exports = class StockController {
  static async deleteStockItem(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).send(errors);
    }

    const sequelizeTransaction = await sequelize.transaction();

    try {
      const stockItem = await StockItem.findByPk(req.params.stockItemId, {
        include: ['product', 'stock']
      });

      await BranchProduct.update({
        quantity: Sequelize.literal(`quantity - ${stockItem.quantity}`)
      }, {
        transaction: sequelizeTransaction,
        where: {
          productId: stockItem.productId,
          branchId: stockItem.stock.branchId
        }
      });

      await Product.update({
        quantity: Sequelize.literal(`quantity - ${stockItem.quantity}`)
      }, {
        transaction: sequelizeTransaction,
        where: {
          id: stockItem.product.id
        }
      });

      await StockItem.destroy({
        transaction: sequelizeTransaction,
        where: {
          id: stockItem.id
        }
      });

      res.send(stockItem);
      sequelizeTransaction.commit();
    } catch(error) {
      sequelizeTransaction.rollback();
      res.sendStatus(500);
      console.error(error);
    }
  }

  static async createStockItem(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).send(errors);
    }

    const sequelizeTransaction = await sequelize.transaction();

    try {
        const stock = await Stock.findByPk(req.body.stockId, {
            transaction: sequelizeTransaction
        });

        const branch = await Branch.findByPk(stock.branchId, {
            transaction: sequelizeTransaction,
        });

        const [product, isProductCreated] = await Product.findOrCreate({
            where: {
              lookupKey: req.body.lookupKey,
            },
            defaults: {
              name: req.body.name,
              quantity: req.body.quantity,
              companyId: branch.companyId,
              costPrice: req.body.costPrice,
              lookupKey: req.body.lookupKey.toUpperCase(),
              unitPrice: req.body.unitPrice || req.body.sellingPrice,
              sellingPrice: req.body.sellingPrice || req.body.unitPrice,
            },
            transaction: sequelizeTransaction,
          });

          const [branchProduct, isBranchProductCreated] = await BranchProduct.findOrCreate({
            where: {
                branchId: branch.id,
                productId: product.id
            },
            defaults: {
                branchId: branch.id,
                productId: product.id,
                quantity: req.body.quantity
            },
            transaction: sequelizeTransaction,
          });

          if (!isBranchProductCreated) {
            // product is already in this branch. update quantity
            await BranchProduct.update({
              quantity: Sequelize.literal(`quantity + ${req.body.quantity}`)
            }, {
              transaction: sequelizeTransaction,
              where: {
                branchId: branchProduct.branchId,
                productId: branchProduct.productId
              }
            });
          }

          if (!isProductCreated) {
            await Product.update({
              quantity: Sequelize.literal(`quantity + ${req.body.quantity}`),
            }, {
              where: { id: product.id },
              transaction: sequelizeTransaction,
            });
          }

        const stockItem = await StockItem.create({
            stockId: req.body.stockId,
            productId: product.id,
            quantity: +req.body.quantity,
            availableQuantity: +req.body.quantity
        }, { transaction: sequelizeTransaction });

        stockItem.setDataValue('product', product);
        res.status(201).send(stockItem);
        sequelizeTransaction.commit();
    } catch(error) {
        sequelizeTransaction.rollback();
        res.sendStatus(500);
        console.error(error);
    }
  }

  static async transferItem(req, res) {
    const sequelizeTransaction = await sequelize.transaction();
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).send(errors);
    }

    try {
      const transferringStockItem = await StockItem.findByPk(req.params.stockItemId, {
        transaction: sequelizeTransaction
      });

      const receivingBranch = await Branch.findByPk(req.body.receivingBranchId, {
        transaction: sequelizeTransaction,
        include: [
          { model: Stock, as: 'stocks' }
        ]
      });

      // update and return target stock item.
      let [receivingStockItem, isReceivingItemCreated] = await StockItem.findOrCreate({
        defaults: {
          quantity: req.body.quantity,
          stockId: receivingBranch.stocks[0].id,
          productId: transferringStockItem.productId
        },
        where: {
          stockId: receivingBranch.stocks[0].id,
          productId: transferringStockItem.productId
        },
        transaction: sequelizeTransaction
      });

      if (!isReceivingItemCreated) {
        await StockItem.update({
          quantity: Sequelize.literal(`quantity + ${req.body.quantity}`)
        }, {
          transaction: sequelizeTransaction,
          where: {
            stockId: receivingBranch.stocks[0].id,
            productId: transferringStockItem.productId
          }
        });
      }

      await StockItem.update({
        quantity: Sequelize.literal(`quantity - ${req.body.quantity}`)
      }, {
        transaction: sequelizeTransaction,
        where: {
          id: transferringStockItem.id
        }
      });

      const stockItemTransfer = await StockItemTransfer.create({
        sendingStockItemId: transferringStockItem.id,
        receivingStockItemId: receivingStockItem.id,
        senderUsername: req.body.senderId,
        quantity: req.body.quantity
      }, {
        transaction: sequelizeTransaction
      });

      sequelizeTransaction.commit();
      res.status(201).send(stockItemTransfer);
    } catch(error) {
      sequelizeTransaction.rollback();
      res.sendStatus(500);
      console.error(error);
    }
  }
}
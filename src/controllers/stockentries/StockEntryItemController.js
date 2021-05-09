'use strict';

const { validationResult } = require('express-validator');

const {
  StockEntry,
  Branch,
  Product,
  sequelize,
  Sequelize,
  StockEntryItem,
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
      const stockItem = await StockEntryItem.findByPk(req.params.stockItemId, {
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

      await StockEntryItem.destroy({
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
        let stockEntryItem = null;

        const stockEntry = await StockEntry.findByPk(req.body.stockId, {
          transaction: sequelizeTransaction
        });

        console.log(stockEntry);

        if(req.validationInput && req.validationInput.isItemPartOfStock) {
          stockEntryItem = await StockEntryItem.update({
            quantity: +req.body.quantity
          }, {
            transaction: sequelizeTransaction,
            where: { id: req.validationInput.stockEntryItemId }
          })
          .then(() => StockEntryItem.findByPk(req.validationInput.stockEntryItemId, {
            transaction: sequelizeTransaction
          }));
        } else {
          stockEntryItem = await StockEntryItem.create({
            stockEntryId: stockEntry.id,
            quantity: +req.body.quantity,
            productId: req.body.productId
          }, { transaction: sequelizeTransaction });
        }

        stockEntryItem.setDataValue('product',
          await Product.findByPk(req.body.productId, {
            transaction: sequelizeTransaction
        }));

        res.status(201).send(stockEntryItem);
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
      const transferringStockItem = await StockEntryItem.findByPk(req.params.stockItemId, {
        transaction: sequelizeTransaction
      });

      const receivingBranch = await Branch.findByPk(req.body.receivingBranchId, {
        transaction: sequelizeTransaction,
        include: [
          { model: StockEntry, as: 'stocks' }
        ]
      });

      // update and return target stock item.
      let [receivingStockItem, isReceivingItemCreated] = await StockEntryItem.findOrCreate({
        defaults: {
          quantity: +req.body.quantity,
          availableQuantity: +req.body.quantity,
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
        await StockEntryItem.update({
          availableQuantity: Sequelize.literal(`availableQuantity + ${req.body.quantity}`)
        }, {
          transaction: sequelizeTransaction,
          where: { id: receivingStockItem.id }
        });
      }

      await StockEntryItem.update({
        availableQuantity: Sequelize.literal(`availableQuantity - ${req.body.quantity}`)
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
'use strict';

const {
  Stock,
  Branch,
  Product,
  sequelize,
  Sequelize,
  StockItem,
  BranchProduct,
} = require('../../sequelize/models/index');

module.exports = class StockController {
    static async createStockItem(req, res) {
        const sequelizeTransaction = await sequelize.transaction();
        console.log(req.body);

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

              if (!isBranchProductCreated) { // product is already in this branch.
                sequelizeTransaction.rollback();
                return res.status(400).send({productId: branchProduct.productId,
                  branchId: branchProduct.branchId});
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
               quantity: branchProduct.quantity
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
}
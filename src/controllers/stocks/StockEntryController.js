'use strict';

const { validationResult } = require('express-validator');
const {
    Product,
    BranchProduct,
    Branch,
    Stock,
    BranchStock,
    StockItem,
    StockEntry,
    StockEntryItem,
    sequelize,
    Sequelize
} = require('../../sequelize/models/index');

module.exports = class StockEntryController {
    static async fetchAll(req, res) {
        res.send(await StockEntry.findAll({
            include: ['branch']
        }));
    }

    static async fetchOne(req, res) {
        try {
            const stock = await StockEntry.findByPk(req.params.id, {
                include: [
                    'branch',
                    { model: StockEntryItem, as: 'items', include: ['product'] }
                ]
            });

            if (!stock) {
                return res.sendStatus(404);
            }

            res.send(stock);
        } catch(error) {
            res.sendStatus(500);
            console.error(error);
        }
    }

    static async fetchBranchStockEntries(req, res) {
        res.send(await StockEntry.findAll({
            where: { branchId: req.params.id },
            order: [['createdAt', 'DESC']],
            include: [
                'branch',
                { model: StockEntryItem, as: 'items', include: ['product'] }
            ]
        }));
    }

    static async fetchCompanyStockEntries(req, res) {
        console.log(req.params);
        try {
            res.send(await StockEntry.findAll({
                where: { companyId: req.params.companyId },
                order: [['isOpened', 'DESC'], ['createdAt', 'DESC']],
                include: [
                    'branch',
                    { model: StockEntryItem, as: 'items', include: ['product'] }
                ]
            }));
        } catch(error) {
            res.sendStatus(500);
            console.error(error);
        }
    }

    static async createStock(req, res) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log(errors);
            return res.status(400).send(errors);
        }

        try {
            const stock = await StockEntry.create({
                isOpened: true,
                branchId: req.body.branchId,
                companyId: req.body.companyId
            });

            const fetchedStock = await StockEntry.findByPk(stock.id, {
                order: [['createdAt', 'DESC']],
                include: ['branch', 'items']
            })

            res.status(201).send(fetchedStock);
        } catch(error) {
            res.sendStatus(500);
            console.log(req.body);
        }
    }

    static async closeStockEntry(req, res) {
        const sequelizeTransaction = await sequelize.transaction();

        try {
            const stockEntry = await StockEntry.findByPk(req.params.id, {
                transaction: sequelizeTransaction,
                include: [
                    { model: StockEntryItem, as: 'items', include: ['product'] }
                ]
            });

            const branch = await Branch.findByPk(stockEntry.branchId, {
                transaction: sequelizeTransaction,
            });

            // const activeStock = await Stock.findOne({
            //     where: { isActive: true },
            //     include: [
            //         { model: BranchStock, as: 'branchStock', where: {
            //             branchId: branch.id
            //         }},
            //         { model: StockItem, as: 'items', include: ['product'] }
            //     ],
            //     transaction: sequelizeTransaction,
            // });

            const [activeStock, isActiveStockCreated] = await Stock.findOrCreate({
                where: { isActive: true },
                include: [
                    { model: BranchStock, as: 'branchStock', where: {
                        branchId: branch.id
                    }},
                    { model: StockItem, as: 'items', include: ['product'] }
                ],
                transaction: sequelizeTransaction,
                defaults: {
                    isActive: true,
                    type: 'branch',
                    companyId: branch.companyId
                }
            });

            let newStock = null;

            if (isActiveStockCreated) {
                activeStock.setDataValue('items', []);
                newStock = activeStock;
            }

            if(!isActiveStockCreated) {
                await Stock.update({
                    isActive: false,
                    dateClosed: new Date()
                }, {
                    where: {
                        id: activeStock.id
                    },
                    transaction: sequelizeTransaction
                });

                newStock = await Stock.create({
                    isActive: true,
                    type: 'branch',
                    companyId: branch.companyId
                }, {
                    transaction: sequelizeTransaction
                });
            }

            await BranchStock.create({
                branchId: branch.id,
                stockId: newStock.id
            }, {
                transaction: sequelizeTransaction
            });

            let newStockItems = stockEntry.items.map(item => {
                return {
                    name: item.product.name,
                    stockId: newStock.id,
                    productId: item.product.id,
                    quantityStocked: item.quantity,
                    availableQuantity: item.quantity
                }
            });

            activeStock.items && activeStock.items.forEach(stockItem => {
                let newStockItem = newStockItems.find(item => item.productId ===
                    stockItem.product.id);

                if (newStockItem) {
                    newStockItem.quantityFromPreviousStock = stockItem.availableQuantity;
                    newStockItem.availableQuantity =
                        newStockItem.quantityStocked + stockItem.availableQuantity;
                } else {
                    newStockItem = {
                        productName: stockItem.product.name,
                        stockId: newStock.id,
                        productId: stockItem.product.id,
                        quantityFromPreviousStock: stockItem.availableQuantity,
                        availableQuantity: stockItem.availableQuantity
                    }

                    newStockItems.push(newStockItem);
                }
            });

            await StockItem.bulkCreate(newStockItems, {
                transaction: sequelizeTransaction
            });

            await StockEntry.update({
                isOpened: false
            }, {
                transaction: sequelizeTransaction,
                where: {
                    id: stockEntry.id
                }
            });

            // sequelizeTransaction.rollback();
            sequelizeTransaction.commit();
            res.send(stockEntry);
        } catch(error) {
            sequelizeTransaction.rollback();
            res.sendStatus(500);
            console.error(error);
        }
    }

    static async deleteStock(req, res) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log(errors);
            return res.status(400).send(errors);
        }

        try {
            const stockEntry = await StockEntry.findByPk(req.params.stockId);

            await StockEntry.destroy({
                where: { id: req.params.stockId }
            });

            res.send(stockEntry);
        } catch(error) {
            res.sendStatus(500);
            console.error(error);
        }
    }
}
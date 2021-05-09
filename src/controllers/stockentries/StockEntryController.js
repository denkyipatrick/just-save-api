'use strict';

const { validationResult } = require('express-validator');
const {
    Product,
    BranchProduct,
    Branch,
    StockEntry,
    StockEntryItem,
    sequelize,
    Sequelize
} = require('../../sequelize/models/index');

module.exports = class StockController {
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

    static async fetchBranchStocks(req, res) {
        res.send(await StockEntry.findAll({
            where: { branchId: req.params.id },
            order: [['createdAt', 'DESC']],
            include: [
                'branch',
                { model: StockEntryItem, as: 'items', include: ['product'] }
            ]
        }));
    }

    static async fetchCompanyStocks(req, res) {
        console.log(req.params);
        try {
            res.send(await StockEntry.findAll({
                where: { companyId: req.params.companyId },
                order: [['createdAt', 'DESC']],
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

    static async closeStock(req, res) {
        const sequelizeTransaction = await sequelize.transaction();

        try {
            const stockEntry = await StockEntry.findByPk(req.params.id, {
                transaction: sequelizeTransaction,
                include: [
                    { model: StockEntryItem, as: 'items' }
                ]
            });

            const branch = await Branch.findByPk(stockEntry.branchId, {
                transaction: sequelizeTransaction,
            });

            for (const item of stockEntry.items) {
                const [branchProduct, isBranchProductCreated] =
                await BranchProduct.findOrCreate({
                    where: {
                        branchId: branch.id,
                        productId: item.productId,
                    },
                    defaults: {
                        branchId: branch.id,
                        quantity: item.quantity,
                        productId: item.productId
                    },
                    transaction: sequelizeTransaction
                });

                if(!isBranchProductCreated) {
                    await BranchProduct.update({
                        quantity: Sequelize.literal(`quantity + ${item.quantity}`)
                    }, {
                        transaction: sequelizeTransaction,
                        where: {
                            branchId: branch.id,
                            productId: item.productId,
                        }
                    });
                }

                await Product.update({
                    quantity: Sequelize.literal(`quantity + ${item.quantity}`)
                }, {
                    transaction: sequelizeTransaction,
                    where: { id: item.productId }
                });
            }

            await StockEntry.update({
                isOpened: false
            }, {
                transaction: sequelizeTransaction,
                where: {
                    id: stockEntry.id
                }
            });

            sequelizeTransaction.commit();
            res.send(stockEntry);
        } catch(error) {
            sequelizeTransaction.rollback();
            res.sendStatus(500);
            console.error(error)
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
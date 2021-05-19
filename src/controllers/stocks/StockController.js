'use strict';

const { validationResult } = require('express-validator');
const {
    Product,
    Branch,
    Stock,
    BranchStock,
    StockItem,
    sequelize,
    Sequelize
} = require('../../sequelize/models/index');

module.exports = class StockController {

    static async fetchBranchStocks(req, res) {
        try {
            const stocks = await Stock.findAll({
                include: [
                    { model: BranchStock, as: 'branchStock', include: ['branch'], where: {
                        branchId: req.params.branchId
                    }},
                    { model: StockItem, as: 'items', include: ['product'] }
                ],
                order: [['isActive', 'DESC']]
            });

            res.send(stocks);
        } catch(error) {
            res.sendStatus(500);
            console.error(error);
        }
    }

    static async fetchCompanyStocks(req, res) {
        try {
            const stocks = await Stock.findAll({
                where: { companyId: req.params.companyId },
                include: [
                    { model: BranchStock, as: 'branchStock', include: ['branch'] },
                    { model: StockItem, as: 'items', include: ['product'] }
                ],
                order: [['isActive', 'DESC']]
            });

            res.send(stocks);
        } catch(error) {
            res.sendStatus(500);
            console.error(error);
        }
    }

    static async fetchCompanyBranchActiveStocks(req, res) {
        try {
            const stocks = await Stock.findAll({
                where: {
                    type: 'branch',
                    isActive: true,
                    companyId: req.params.companyId
                },
                include: [
                    { model: BranchStock, as: 'branchStock', include: ['branch'] },
                    { model: StockItem, as: 'items', include: ['product'] }
                ],
            });

            res.send(stocks);
        } catch(error) {
            res.sendStatus(500);
            console.error(error);
        }
    }

    static async fetchStock(req, res) {
        try {
            const stock = await Stock.findOne({
                where: {
                    id: req.params.stockId
                },
                include: [
                    { model: BranchStock, as: 'branchStock', include: ['branch'] },
                    { model: StockItem, as: 'items', include: ['product'] }
                ]
            });

            res.send(stock);
        } catch(error) {
            res.sendStatus(500);
            console.error(error);
        }
    }

    static async fetchBranchActiveStock(req, res) {
        try {
            const activeStock = await Stock.findOne({
                where: { isActive: true },
                include: [
                    { model: BranchStock, as: 'branchStock', include: ['branch'], where: {
                        branchId: req.params.branchId
                    } },
                    { model: StockItem, as: 'items', include: ['product'] }
                ]
            });

            res.send(activeStock);
        } catch(error) {
            res.sendStatus(500);
            console.error(error);
        }
    }
}
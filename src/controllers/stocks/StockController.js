'use strict';

const { validationResult } = require('express-validator');
const {
    Product,
    Branch,
    CompanyStock,
    CompanyBranchStock,
    CompanyStockItem,
    sequelize,
    Sequelize
} = require('../../sequelize/models/index');

module.exports = class StockController {

    static async fetchBranchStocks(req, res) {
        try {
            const stocks = await CompanyStock.findAll({
                include: [
                    { model: CompanyBranchStock, as: 'branchStock', include: ['branch'], where: {
                        branchId: req.params.branchId
                    }},
                    { model: CompanyStockItem, as: 'items', include: ['product'] }
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
            const stocks = await CompanyStock.findAll({
                where: { companyId: req.params.companyId },
                include: [
                    { model: CompanyBranchStock, as: 'branchStock', include: ['branch'] },
                    { model: CompanyStockItem, as: 'items', include: ['product'] }
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
            const stocks = await CompanyStock.findAll({
                where: {
                    type: 'branch',
                    isActive: true,
                    companyId: req.params.companyId
                },
                include: [
                    { model: CompanyBranchStock, as: 'branchStock', include: ['branch'] },
                    { model: CompanyStockItem, as: 'items', include: ['product'] }
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
            const stock = await CompanyStock.findOne({
                where: {
                    id: req.params.stockId
                },
                include: [
                    { model: CompanyBranchStock, as: 'branchStock', include: ['branch'] },
                    { model: CompanyStockItem, as: 'items', include: ['product'] }
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
            const activeStock = await CompanyStock.findOne({
                where: { isActive: true },
                include: [
                    { model: CompanyBranchStock, as: 'branchStock', include: ['branch'], where: {
                        branchId: req.params.branchId
                    } },
                    { model: CompanyStockItem, as: 'items', include: ['product'] }
                ]
            });

            res.send(activeStock);
        } catch(error) {
            res.sendStatus(500);
            console.error(error);
        }
    }
}
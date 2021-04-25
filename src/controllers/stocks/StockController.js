'use strict';

const { validationResult } = require('express-validator');
const { Stock, StockItem } = require('../../sequelize/models/index');

module.exports = class StockController {
    static async fetchAll(req, res) {
        res.send(await Stock.findAll({
            include: ['branch']
        }));
    }

    static async fetchOne(req, res) {
        try {
            const stock = await Stock.findByPk(req.params.id, {
                include: [
                    'branch',
                    { model: StockItem, as: 'items', include: ['product'] }
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
        res.send(await Stock.findAll({
            where: { branchId: req.params.id },
            order: [['createdAt', 'DESC']],
            include: ['branch', 'items']
        }));
    }

    static async fetchCompanyStocks(req, res) {
        console.log(req.params);
        try {
            res.send(await Stock.findAll({
                where: { companyId: req.params.companyId },
                order: [['createdAt', 'DESC']],
                include: ['branch', 'items']
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
            const stock = await Stock.create({
                isOpened: true,
                branchId: req.body.branchId,
                companyId: req.body.companyId
            });

            const fetchedStock = await Stock.findByPk(stock.id, {
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
        try {
            console.log(req.params);
            const stock = await Stock.update({
                isOpened: false
            }, {
                where: {
                    id: req.params.id
                }
            })
            .then(() => Stock.findByPk(req.params.id));

            res.send(stock);
        } catch(error) {
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
            const stock = await Stock.findByPk(req.params.stockId);

            await Stock.destroy({
                where: { id: req.params.stockId }
            });

            res.send(stock);
        } catch(error) {
            res.sendStatus(500);
            console.error(error);
        }
    }
}
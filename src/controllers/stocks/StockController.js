'use strict';

const { Stock, StockItem } = require('../../sequelize/models/index');

module.exports = class StockController {
    static async fetchAll(req, res) {
        res.send(await Stock.findAll());
    }

    static async fetchOne(req, res) {
        res.send(await Stock.findByPk(req.params.id));
    }

    static async createStock(req, res) {
        try {
            const stock = await Stock.create({
                isOpened: true,
                branchId: req.body.branchId
            });

            res.status(201).send(stock);
        } catch(error) {
            res.sendStatus(500);
            console.log(req.body);
        }
    }

    static async closeStock(req, res) {
        try {
            const stock = await Stock.update({
                isOpened: false
            }, {
                where: {
                    id: req.params.id
                }
            });

            res.send(stock);
        } catch(error) {
            res.sendStatus(500);
            console.error(error)
        }
    }
}
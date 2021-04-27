'use strict';

const { validationResult } = require('express-validator');
const { Order } = require('../../sequelize/models/index');

module.exports = class OrderController {
    static async fetchAll(req, res) {
        res.send(await Stock.findAll({
            include: ['branch']
        }));
    }

    static async fetchBranchOrders(req, res) {
        try {
            const orders = await Order.findAll({
                order: [['createdAt', 'DESC']],
                include: ['staff', 'branch', 'items'],
                where: {
                  branchId: req.params.branchId
                }
            });

            res.send(orders);
        } catch(error) {
            res.sendStatus(500);
            console.error(error);
        }
    }

    static async fetchCompanyOrders(req, res) {
        try {
            const orders = await Order.findAll({
                order: [['createdAt', 'DESC']],
                include: ['staff', 'branch', 'items'],
                where: {
                  companyId: req.params.companyId
                }
            });

            res.send(orders);
        } catch(error) {
            res.sendStatus(500);
            console.error(error);
        }
    }
}
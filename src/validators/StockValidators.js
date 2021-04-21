'use strict';

const { body } = require('express-validator');
const { Stock } = require('../sequelize/models/index');

const validators = [
    body('branchId').notEmpty().withMessage('Branch not selected.')
    .isString().withMessage('Branch ID should be a string.')
    .bail(),
    body('stock_opened')
    .custom(async value => {
        const stocks = await Stock.findAll({
            where: { isOpened: true }
        });

        if (stocks.length) {
            return Promise.reject("You already have an opened stock. Close it first.");
        }

        return Promise.resolve();
    })
];

module.exports = validators;
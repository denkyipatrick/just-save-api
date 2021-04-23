'use strict';

const { body } = require('express-validator');
const { Stock } = require('../sequelize/models/index');

const postValidators = [
    body('stockId')
    .notEmpty()
    .withMessage("Stock ID is required")
    .custom(async (stockId, { req }) => {
        const stock = await Stock.findByPk(stockId);

        if (!stock) {
            return Promise.reject("Stock not available.");
        }

        if (!stock.isOpened) {
            return Promise.reject("Stock is closed.");
        }

        req.body.stock = stock;
    })
];

module.exports = {
    postValidators
};
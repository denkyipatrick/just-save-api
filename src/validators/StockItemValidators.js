'use strict';

const { body, check, param } = require('express-validator');
const { Stock, StockItem } = require('../sequelize/models/index');

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
    .bail(),
    check('stock_item')
    .custom(async (value, { req }) => {
        const stockItem = await StockItem.findOne({
            include: [
                'product'
            ],
            where: {
                stockId: req.body.stockId,
                "$product.lookupKey$": req.body.lookupKey
            }
        });

        if (stockItem) {
            return Promise.reject("Item already added to this stock.");
        };
    })
];

const deleteValidators = [
    param('stockItemId')
    .notEmpty()
    .withMessage("stock item id must be provided.")
    .bail()
    .custom(async (value, { req }) => {
        const stockItem = await StockItem.findByPk(value, {
            include: ['stock']
        });

        if (stockItem && !stockItem.stock.isOpened) {
            return Promise.reject("Stock is closed.");
        }
    })
]

module.exports = {
    postValidators,
    deleteValidators
};
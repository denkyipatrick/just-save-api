'use strict';

const { body, check, param } = require('express-validator');
const { StockEntry, StockEntryItem } = require('../sequelize/models/index');

const postValidators = [
    body('stockId')
    .notEmpty()
    .withMessage("Stock ID is required")
    .custom(async (stockId, { req }) => {
        const stock = await StockEntry.findByPk(stockId);

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
        const stockEntryItem = await StockEntryItem.findOne({
            include: [
                'product'
            ],
            where: {
                stockId: req.body.stockId,
                "$product.id$": req.body.productId
            }
        });

        if (stockEntryItem) {
            req.validationInput = {
                stockEntryItemId: stockEntryItem.id,
                isItemPartOfStock: true
            };
        };
    })
];

const deleteValidators = [
    param('stockItemId')
    .notEmpty()
    .withMessage("stock item id must be provided.")
    .bail()
    .custom(async (value, { req }) => {
        const stockItem = await StockEntryItem.findByPk(value, {
            include: ['stock']
        });

        if (stockItem && !stockItem.stock.isOpened) {
            return Promise.reject("Stock is closed.");
        }
    })
];

const transferItemValidators = [
    param('stockItemId')
    .notEmpty()
    .withMessage('Item ID is invalid.')
    .bail(),
    body('quantity')
    .notEmpty()
    .withMessage('Quantity is required.')
    .toInt()
]

module.exports = {
    postValidators,
    deleteValidators,
    transferItemValidators
};
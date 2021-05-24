'use strict';

const { body, param } = require('express-validator');
const { Company, StockEntry, Branch } = require('../sequelize/models/index');

const postValidators = [
    body('branchId')
    .notEmpty()
    .withMessage('Branch not selected.')
    .isString()
    .withMessage('Branch ID should be a string.')
    .bail()
    .custom(async (branchId, { req }) => {
        const branch = await Branch.findByPk(branchId);
        if (!branch) {
            return Promise.reject("Branch not found");
        }

        req.body.branch = branch;
    }),
    body('companyId')
    .exists()
    .withMessage("Company ID is required.")
    .bail()
    .notEmpty()
    .withMessage("No company selected.")
    .isString()
    .withMessage("Company ID should be a string.")
    .bail()
    .custom(async (companyId, { req, }) => {
        const company = await Company.findByPk(companyId);
        if (!company) {
            return Promise.reject("Company not found.");
        }

        req.body.company = company;
    })
    .bail(),
    body('stock_opened')
    .custom(async (value, { req }) => {
        const stockEntries = await StockEntry.findAll({
            where: {
                isOpened: true,
                branchId: req.body.branchId,
                companyId: req.body.companyId
            }
        });

        if (stockEntries.length) {
            return Promise.reject("You already have an opened Stock Entry. Close it first.");
        }

        return Promise.resolve();
    })
    .withMessage()
];

const closeEntryValidators = [
    body('has_no_items')
    .custom(async (_, {req}) => {
        const entry = await StockEntry.findByPk(req.params.id, {
            include: ['items']
        });

        if (!entry.items.length) {
            return Promise.reject("You cannot close an empty stock entry")
        }
    })
]

const deleteValidators = [
    param('stockId')
    .notEmpty()
    .withMessage("Stock id is required.")
    .bail()
    // body('hasItems')
    // .custom(async (value, { req }) => {
    //     const stockEntry = await StockEntry.findByPk(req.params.stockId, {
    //         include: ['items']
    //     });

    //     if (!stockEntry) {
    //         return Promise.reject("Stock is not found.");
    //     }

    //     if (stockEntry.items.length) {
    //         return Promise.reject("Stock has items.");
    //     }
    // })
]

module.exports = {
    postValidators,
    deleteValidators,
    closeEntryValidators,
};
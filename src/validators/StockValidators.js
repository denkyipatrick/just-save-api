'use strict';

const { body } = require('express-validator');
const { Company, Stock, Branch } = require('../sequelize/models/index');

const validators = [
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
        const stocks = await Stock.findAll({
            where: {
                isOpened: true,
                branchId: req.body.branchId,
                companyId: req.body.companyId
            }
        });

        if (stocks.length) {
            return Promise.reject("You already have an opened stock. Close it first.");
        }

        return Promise.resolve();
    })
    .withMessage()
];

module.exports = validators;
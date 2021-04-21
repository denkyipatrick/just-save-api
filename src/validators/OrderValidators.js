'use strict';

const { body } = require('express-validator');
const { Order } = require('../sequelize/models/index');

const validators = [
    body('items')
    .isArray()
];

module.exports = validators;
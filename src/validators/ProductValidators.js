'use strict';

const { body } = require('express-validator');

const postValidators = [];
const deleteValidators = [];

module.exports = {
    postValidators,
    deleteValidators
};
'use strict';

const BASE_URL = process.env.BASE_URL;
const BRANCH_PRODUCTS_URL = `${BASE_URL}/branchproducts`;
const controllers = require('../controllers/index');

module.exports = app => {
  app.put(`${BRANCH_PRODUCTS_URL}/change-quantity`,
    controllers.UpdateBranchProductController.updateQuantity);
};

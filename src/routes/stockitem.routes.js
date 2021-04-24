'use strict';

const BASE_URL = process.env.BASE_URL;
const STOCK_ITEMS_URL = `${BASE_URL}/stockitems`;
const controllers = require('../controllers/index');
const validators = require('../validators/StockItemValidators');

module.exports = app => {
  app.post(
    STOCK_ITEMS_URL,
    validators.postValidators,
    controllers.StockItemController.createStockItem);

  app.delete(
    `${STOCK_ITEMS_URL}/:stockItemId`,
    validators.deleteValidators,
    controllers.StockItemController.deleteStockItem);
};

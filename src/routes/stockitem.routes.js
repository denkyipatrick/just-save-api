'use strict';

const BASE_URL = process.env.BASE_URL;
const STOCK_ITEMS_URL = `${BASE_URL}/stockitems`;
const controllers = require('../controllers/index');

module.exports = app => {
  app.post(STOCK_ITEMS_URL, controllers.StockItemController.createStockItem);
};

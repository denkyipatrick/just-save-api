'use strict';

const BASE_URL = process.env.BASE_URL;
const STOCKS_URL = `${BASE_URL}/stocks`;
const controller = require('../controllers/index');

module.exports = app => {
  app.get(`${STOCKS_URL}/:stockId`, controller.StockController.fetchStock);
};

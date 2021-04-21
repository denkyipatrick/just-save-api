'use strict';

const BASE_URL = process.env.BASE_URL;
const STOCKS_URL = `${BASE_URL}/stocks`;

const controllers = require('../controllers/index');

module.exports = app => {
  app.route(STOCKS_URL)
    .get(controllers.StockController.fetchAll)
    .post(controllers.StockController.createStock);

  app.route(`${STOCKS_URL}/:id`)
    .get(controllers.StockController.fetchOne);

  app.patch(`${STOCKS_URL}/:id/close`, controllers.StockController.closeStock);
};

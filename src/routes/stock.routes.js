'use strict';

const BASE_URL = process.env.BASE_URL;
const STOCKS_URL = `${BASE_URL}/stocks`;

const controllers = require('../controllers/index');
const postValidators = require('../validators/StockValidators');

module.exports = app => {
  app.route(STOCKS_URL)
    .get(controllers.StockController.fetchAll);

  app.route(`${STOCKS_URL}/:id`)
    .get(controllers.StockController.fetchOne);

  app.post(STOCKS_URL, postValidators, controllers.StockController.createStock)
  app.patch(`${STOCKS_URL}/:id/close`, controllers.StockController.closeStock);
};

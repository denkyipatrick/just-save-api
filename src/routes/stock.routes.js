'use strict';

const BASE_URL = process.env.BASE_URL;
const STOCKS_URL = `${BASE_URL}/stocks`;

const controllers = require('../controllers/index');
const validators = require('../validators/StockValidators');

module.exports = app => {
  app.route(STOCKS_URL).get(controllers.StockController.fetchAll);
  app.route(`${STOCKS_URL}/:id`).get(controllers.StockController.fetchOne);
  app.patch(`${STOCKS_URL}/:id/close`, controllers.StockController.closeStock);
  app.post(
    STOCKS_URL,
    validators.postValidators,
    controllers.StockController.createStock);
  app.delete(
    `${STOCKS_URL}/:stockId`,
    validators.deleteValidators,
    controllers.StockController.deleteStock);
};

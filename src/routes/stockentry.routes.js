'use strict';

const BASE_URL = process.env.BASE_URL;
const STOCKS_URL = `${BASE_URL}/stocks`;

const controllers = require('../controllers/index');
const validators = require('../validators/StockValidators');

module.exports = app => {
  app.route(STOCKS_URL).get(controllers.StockEntryController.fetchAll);
  app.route(`${STOCKS_URL}/:id`).get(controllers.StockEntryController.fetchOne);
  app.patch(`${STOCKS_URL}/:id/close`, controllers.StockEntryController.closeStock);
  app.post(
    STOCKS_URL,
    validators.postValidators,
    controllers.StockEntryController.createStock);
  app.delete(
    `${STOCKS_URL}/:stockId`,
    validators.deleteValidators,
    controllers.StockEntryController.deleteStock);
};

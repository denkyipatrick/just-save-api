'use strict';

const BASE_URL = process.env.BASE_URL;
const STOCK_ENTRIES_URL = `${BASE_URL}/stock-entries`;

const controllers = require('../controllers/index');
const validators = require('../validators/StockEntryValidators');

module.exports = app => {
  app.route(STOCK_ENTRIES_URL).get(controllers.StockEntryController.fetchAll);
  app.route(`${STOCK_ENTRIES_URL}/:id`).get(controllers.StockEntryController.fetchOne);
  app.patch(`${STOCK_ENTRIES_URL}/:id/close`, controllers.StockEntryController.closeStockEntry);
  app.post(
    STOCK_ENTRIES_URL,
    validators.postValidators,
    controllers.StockEntryController.createStock);
  app.delete(
    `${STOCK_ENTRIES_URL}/:stockId`,
    validators.deleteValidators,
    controllers.StockEntryController.deleteStock);
};

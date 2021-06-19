'use strict';

const BASE_URL = `${process.env.BASE_URL}/stock-items`;
const controller = require('../controllers/index');

module.exports = app => {
  app.patch(`${BASE_URL}/:stockItemId/edit-quantity`,
    controller.StockItemController.changeQuantity);
};

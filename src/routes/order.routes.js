'use strict';

const BASE_URL = process.env.BASE_URL;
const ORDERS_URL = `${BASE_URL}/orders`;
const controllers = require('../controllers/index');

module.exports = app => {
    app.get(`${ORDERS_URL}/:orderId`, controllers.FetchOrderDetailController.fetchOne)
    app.post(`${ORDERS_URL}`, controllers.CreateOrderController.create);
};

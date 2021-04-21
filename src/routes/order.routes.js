'use strict';

const BASE_URL = process.env.BASE_URL;
const ORDERS_URL = `${BASE_URL}/orders`;
const controllers = require('../controllers/index');
const postValidators = require('../validators/OrderValidators');

module.exports = app => {
    app.get(`${ORDERS_URL}/:orderId`, controllers.FetchOrderDetailController.fetchOne)
    app.post(`${ORDERS_URL}`, postValidators, controllers.CreateOrderController.create);
};

'use strict';

const { Order, NewStaff, OrderItem } = require('../../sequelize/models/index');

module.exports = class FetchOrderDetailController {
  static async fetchOne(req, res) {
    try {
      res.send(await Order.findByPk(req.params.orderId, {
        include: [
          { model: NewStaff, as: 'staff' },
          { model: OrderItem, as: 'items', include: ['product'] }
        ]
      }));
    } catch (error) {
      res.sendStatus(500);
      console.error(error);
    }
  }
};

'use strict';

const { Order } = require('../../sequelize/models/index');

module.exports = class FetchCompanyOrdersController {
  static async fetchAll(req, res) {
    try {
      res.send(await Order.findAll({
        order: [['createdAt', 'DESC']],
        include: ['staff', 'branch', 'items'],
        where: {
          companyId: req.params.companyId
        }
      }));
    } catch (error) {
      res.sendStatus(500);
      console.error(error);
    }
  }
};

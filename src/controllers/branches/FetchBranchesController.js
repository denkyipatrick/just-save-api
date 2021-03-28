'use strict';

const { Branch } = require('../../sequelize/models/index');

module.exports = class FetchBranchesController {
  static async fetchAll(req, res) {
    try {
      res.send(await Branch.findAll({
        order: [['name', 'ASC']],
      }));
    } catch (error) {
      res.sendStatus(500);
      console.error(error);
    }
  }
};

'use strict';

const { Branch } = require('../../sequelize/models/index');

module.exports = class CreateBranchController {
  static async create(req, res) {
    console.log(req.body);
    try {
      const branch = await Branch.create({
        name: req.body.name,
        address: req.body.address,
        companyId: req.body.companyId,
      });

      res.send(branch);
    } catch (error) {
      res.sendStatus(500);
      console.error(error);
    }
  }
};

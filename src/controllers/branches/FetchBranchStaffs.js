'use strict';

const { NewStaff } = require('../../sequelize/models/index');

module.exports = class FetchBranchStaffs {
  static async fetchAllStaffs(req, res) {
    try {
      console.log(req.params);
      const staffList = await NewStaff.findAll({
        order: [['firstName', 'ASC'], ['lastName', 'ASC']],
        include: [
          'roles',
          'staffBranch'
        ],
        where: {
          "$staffBranch.branchId$": req.params.branchId
        },
      });

      res.send(staffList);
    } catch (error) {
      res.sendStatus(500);
      console.error(error);
    }
  }
};

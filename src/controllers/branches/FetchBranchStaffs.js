'use strict';

const { Staff } = require('../../sequelize/models/index');

module.exports = class FetchBranchStaffs {
  static async fetchAllStaffs(req, res) {
    try {
      const staffList = await Staff.findAll({
        order: [['firstName', 'ASC'], ['lastName', 'ASC']],
        include: ['roles'],
        where: {
          branchId: req.params.branchId,
        },
      });

      res.send(staffList);
    } catch (error) {
      res.sendStatus(500);
      console.error(error);
    }
  }
};

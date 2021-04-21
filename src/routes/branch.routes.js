'use strict';

const BASE_URL = process.env.BASE_URL;
const BRANCHES_URL = `${BASE_URL}/branches`;
const controllers = require('../controllers/index');

module.exports = app => {
  app.post(`${BRANCHES_URL}`, controllers.CreateBranchController.create);
  app.get(`${BRANCHES_URL}`, controllers.FetchBranchesController.fetchAll);
  app.get(`${BRANCHES_URL}/:id/stocks`, controllers.StockController.fetchBranchStocks);
  app.get(`${BRANCHES_URL}/:branchId/staffs`,
    controllers.FetchBranchStaffs.fetchAllStaffs);
  app.get(`${BRANCHES_URL}/:branchId/products`,
    controllers.FetchBranchProducts.fetchAllProducts);
};

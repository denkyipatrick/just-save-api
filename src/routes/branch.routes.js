'use strict';

const BASE_URL = process.env.BASE_URL;
const BRANCHES_URL = `${BASE_URL}/branches`;
const controllers = require('../controllers/index');

module.exports = app => {
  app.post(`${BRANCHES_URL}`, controllers.CreateBranchController.create);
  app.get(`${BRANCHES_URL}`, controllers.FetchBranchesController.fetchAll);
  app.get(`${BRANCHES_URL}/:branchId/stocks`, controllers.StockController.fetchBranchStocks);
  app.get(`${BRANCHES_URL}/:branchId/active-stock`, controllers.StockController.fetchBranchActiveStock);
  app.get(`${BRANCHES_URL}/:id/stock-entries`, controllers.StockEntryController.fetchBranchStockEntries);
  app.get(`${BRANCHES_URL}/:branchId/orders`, controllers.OrderController.fetchBranchOrders);
  app.get(`${BRANCHES_URL}/:branchId/staffs`, controllers.FetchBranchStaffs.fetchAllStaffs);
  app.get(`${BRANCHES_URL}/:branchId/products`, controllers.BranchProductController.fetchBranchProducts);
};

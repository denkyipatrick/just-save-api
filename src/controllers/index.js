'use strict';

const FetchBranchStaffs = require('./branches/FetchBranchStaffs');
const FetchBranchProducts = require('./branches/FetchBranchProductsController');
const CreateBranchController = require('./branches/CreateBranchController');
const FetchBranchesController = require('./branches/FetchBranchesController');
const FetchOrderDetailController = require('./orders/FetchOrderDetailController');
const FetchCompanyOrdersController = require('./companies/FetchCompanyOrdersController');

// Staff Controllers
const CreateStaffController = require('./staffs/CreateStaffController');
const CreateOrderController = require('./orders/CreateOrderController');

const UpdateProductNameController = require('./products/UpdateProductNameController');
const UpdateProductPriceController = require('./products/UpdateProductPriceController');
const UpdateBranchProductController = require('./branchproduct/UpdateBranchProductController');

module.exports = {
  CreateStaffController,
  CreateOrderController,
  CreateBranchController,

  FetchBranchStaffs,
  FetchBranchProducts,
  FetchBranchesController,
  FetchOrderDetailController,
  FetchCompanyOrdersController,

  UpdateProductNameController,
  UpdateProductPriceController,
  UpdateBranchProductController
};

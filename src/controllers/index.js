'use strict';

const FetchBranchStaffs = require('./branches/FetchBranchStaffs');
const FetchBranchProducts = require('./branches/FetchBranchProductsController');
const CreateBranchController = require('./branches/CreateBranchController');
const FetchBranchesController = require('./branches/FetchBranchesController');

// Staff Controllers
const CreateStaffController = require('./staffs/CreateStaffController');

const UpdateProductNameController = require('./products/UpdateProductNameController');
const UpdateProductPriceController = require('./products/UpdateProductPriceController');
const UpdateBranchProductController = require('./branchproduct/UpdateBranchProductController');

module.exports = {
  CreateStaffController,

  FetchBranchStaffs,
  FetchBranchProducts,
  CreateBranchController,
  FetchBranchesController,
  UpdateProductNameController,
  UpdateProductPriceController,
  UpdateBranchProductController
};

'use strict';

const FetchBranchStaffs = require('./branches/FetchBranchStaffs');
const FetchBranchProducts = require('./branches/FetchBranchProductsController');
const CreateBranchController = require('./branches/CreateBranchController');
const FetchBranchesController = require('./branches/FetchBranchesController');
const FetchOrderDetailController = require('./orders/FetchOrderDetailController');
const FetchCompanyOrdersController = require('./companies/FetchCompanyOrdersController');

const BranchProductController = require('./branchproducts/BranchProductController')
const ProductController = require('./products/ProductController');
const StockController = require('./stocks/StockController');
const StockItemController = require('./stocks/StockItemController');
const StockEntryController = require('./stocks/StockEntryController');
const OrderController = require('./orders/OrderController');
const StockEntryItemController = require('./stocks/StockEntryItemController');

// Staff Controllers
const CreateStaffController = require('./staffs/CreateStaffController');
const CreateOrderController = require('./orders/CreateOrderController');

const UpdateProductNameController = require('./products/UpdateProductNameController');
const UpdateProductPriceController = require('./products/UpdateProductPriceController');
const UpdateBranchProductController = require('./branchproducts/UpdateBranchProductController');

module.exports = {
  CreateStaffController,
  CreateOrderController,
  CreateBranchController,

  OrderController,
  StockController,
  StockItemController,
  StockEntryController,
  ProductController,
  StockEntryItemController,
  BranchProductController,

  FetchBranchStaffs,
  FetchBranchProducts,
  FetchBranchesController,
  FetchOrderDetailController,
  FetchCompanyOrdersController,

  UpdateProductNameController,
  UpdateProductPriceController,
  UpdateBranchProductController
};

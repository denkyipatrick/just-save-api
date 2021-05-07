'use strict';

const {
    BranchProduct
} = require('../../sequelize/models/index');

module.exports = class BranchProductController {
    static async fetchBranchProducts(req, res) {
        try {
            const branchProducts = await BranchProduct.findAll({
                where: {
                    branchId: req.params.branchId
                },
                include: ['product', 'branch']
            });

            res.send(branchProducts);
        } catch(error) {
            res.sendStatus(500);
        }
    }
}
'use strict';

const {
    Product,
    sequelize
} = require('../../sequelize/models/index');

module.exports = class ProductController {
    static async createProduct(req, res) {
        const sequelizeTransaction = await sequelize.transaction();

        try {
            const [product, isProductCreated] = await Product.findOrCreate({
                where: {
                    lookupKey: req.body.lookupKey,
                },
                defaults: {
                    quantity: 0,
                    name: req.body.name,
                    companyId: req.body.companyId,
                    costPrice: req.body.costPrice,
                    lookupKey: req.body.lookupKey.toUpperCase(),
                    unitPrice: req.body.unitPrice || req.body.sellingPrice,
                    sellingPrice: req.body.sellingPrice || req.body.unitPrice,
                },
                transaction: sequelizeTransaction,
            });

            res.status(201).send(product);
            sequelizeTransaction.commit();
        } catch (error) {
            sequelizeTransaction.rollback();
            res.sendStatus(500);
            console.error(error);
        }
    }
}
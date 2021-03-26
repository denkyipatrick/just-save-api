
const BASE_URL = process.env.BASE_URL;
const PRODUCTS_URL = `${BASE_URL}/products`;
const { Product, Branch, BranchProduct, Sequelize, sequelize } = require('../sequelize/models/index')

module.exports = app => {
    app.get(`${PRODUCTS_URL}`, async (req, res) => {
        try {
            const products = await Product.findAll({
                order: [['name', 'ASC']],
                include: [
                    { model: BranchProduct, as: 'productBranches', include: ['branch'] }
                ]
            });
    
            res.send(products);
        } catch(error) {
            res.sendStatus(500);
            console.error(error);
        }
    });
    
    app.get(`${PRODUCTS_URL}/lookup/:key`, async (req, res) => {
        console.log(req.params);

        try {
            const products = await Product.findAll({
                order: [['name', 'ASC']],
                where: {
                    lookupKey: {
                        [Sequelize.Op.like]: `${req.params.key}%`
                    }
                }
            });

            console.log(products.length);
    
            res.send(products);
        } catch(error) {
            res.sendStatus(500);
            console.error(error);
        }
    });
    
    app.get(`${PRODUCTS_URL}/:id`, async (req, res) => {
        try {
            const product = await Product.findByPk(req.params.id, {
                include: [
                    { model: BranchProduct, as:  'productBranches', include: ['branch']  }
                ]
            });
    
            res.send(product);            
        } catch(error) {
            res.sendStatus(500);
            console.error(error);
        }
    });

    app.post(`${PRODUCTS_URL}`, async (req, res) => {
        console.log(req.body);

        const sequelizeTransaction = await sequelize.transaction();

        try {
            const branch = await Branch.findByPk(req.body.branchId, {
                transaction: sequelizeTransaction
            });

            const [product, isProductCreated] = await Product.findOrCreate({
                where: {
                    lookupKey: req.body.lookupKey
                },
                defaults: {
                    name: req.body.name,
                    quantity: req.body.quantity,
                    companyId: branch.companyId,
                    costPrice: req.body.costPrice,
                    lookupKey: req.body.lookupKey.toUpperCase(),
                    unitPrice: req.body.unitPrice || req.body.sellingPrice,
                    sellingPrice: req.body.sellingPrice || req.body.unitPrice
                },
                transaction: sequelizeTransaction
            });
            
            const [branchProduct, isBranchProductCreated] = await BranchProduct.findOrCreate({
                where: {
                    productId: product.id,
                    branchId: req.body.branchId
                },
                defaults: {
                    productId: product.id,
                    quantity: req.body.quantity,
                    branchId: req.body.branchId
                },
                transaction: sequelizeTransaction
            });

            if (!isBranchProductCreated) { // product is already in this branch.
                sequelizeTransaction.rollback();
                return res.status(400).send({productId: branchProduct.productId, 
                    branchId: branchProduct.branchId});
            }
            
            if (!isProductCreated) {
                await Product.update({
                    quantity: Sequelize.literal(`quantity + ${req.body.quantity}`)
                }, { 
                    where: { id: product.id },
                    transaction: sequelizeTransaction
                });
            }
            
            res.status(201).send(product);
            sequelizeTransaction.commit();
        } catch(error) {
            sequelizeTransaction.rollback();
            res.sendStatus(500);
            console.error(error);
        }
    });
}
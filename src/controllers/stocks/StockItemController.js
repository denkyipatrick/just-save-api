'use strict';

const {
    CompanyStockItem,
    Sequelize
} = require('../../sequelize/models/index');

module.exports = class StockItemController {
    static async changeQuantity(req, res) {
        try {
            if (req.body.editType.toLowerCase() === 'add') {
                await CompanyStockItem.update({
                    availableQuantity: Sequelize.literal(`availableQuantity + ${req.body.quantity}`),
                    quantityStocked: Sequelize.literal(`quantityStocked + ${req.body.quantity}`)
                }, {
                    where: {
                        id: req.params.stockItemId
                    }
                })
            }

            if (req.body.editType.toLowerCase() === 'subtract') {
                await CompanyStockItem.update({
                    availableQuantity: Sequelize.literal(`availableQuantity - ${req.body.quantity}`),
                    quantityStocked: Sequelize.literal(`quantityStocked - ${req.body.quantity}`)
                }, {
                    where: {
                        id: req.params.stockItemId
                    }
                })
            }

            const item = await CompanyStockItem.findByPk(req.params.stockItemId);

            res.send(item);
        } catch(error) {
            res.sendStatus(500);
            console.error(error);
        }
    }
}
'use strict';

const { body } = require('express-validator');
const { Order, StockItem } = require('../sequelize/models/index');

const validators = [
    body('items')
    .isArray()
    .bail(),
    body('insufficient_quantity')
    .custom(async (value, { req }) => {
        let someItemsAreInsufficient = false;
        let insufficientQuantityErrorMessages = [];

        console.log(req.body.items);

        const stockItems = await StockItem.findAll({
            where: {
            id: req.body.items.map(item => item.stockItemId)
            },
            include: ['product']
        });

      // console.log(stockItems);

      stockItems.forEach(stockItem => {
        const cartItem = req.body.items.find(cItem => cItem.stockItemId === stockItem.id);

        if (stockItem.availableQuantity < cartItem.quantity) {
          someItemsAreInsufficient = true;
          const errorMessage = {
            productName: stockItem.product.name,
            availableQuantity: stockItem.availableQuantity
          }

          insufficientQuantityErrorMessages.push(errorMessage);
        }
      });

      if (someItemsAreInsufficient) {

          return Promise.reject('Insufficient Product Quantities');
      }
    })
];

module.exports = validators;
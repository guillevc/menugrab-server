const { orderProperties } = require('../../../shared/properties');
const { OrderType } = require('../../../shared/enums');

const createOrderSchema = {
  body: {
    type: 'object',
    properties: {
      restaurantId: { type: 'string' },
      orderType: {
        type: 'string',
        enum: Object.values(OrderType)
      },
      items: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            menuItemId: { type: 'string' },
            quantity: { type: 'number' }
          },
          required: ['menuItemId', 'quantity']
        }
      }
    },
    required: ['restaurantId', 'orderType', 'items']
  },
  response: {
    200: {
      type: 'object',
      properties: orderProperties
    }
  },
  tags: ['orders']
};

const getOrderSchema = {
  params: {
    type: 'object',
    properties: {
      id: { type: 'string' }
    },
    required: ['id']
  },
  response: {
    200: {
      type: 'object',
      properties: orderProperties
    }
  },
  tags: ['orders']
};

module.exports = {
  createOrderSchema,
  getOrderSchema
};

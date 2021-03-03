const {
  orderProperties
} = require('../shared/properties');

const { OrderType } = require('../shared/enums');

const createOrderSchema = {
  body: {
    type: 'object',
    properties: {
      restaurantId: { type: 'string' },
      orderType: {
        type: 'string',
        enum: Object.values(OrderType)
      },
      menuItems: {
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
    required: ['restaurantId', 'orderType', 'menuItems']
  },
  response: {
    200: {
      type: 'object',
      properties: orderProperties
    }
  }
};

const getOrderSchema = {
  params: {
    type: 'object',
    properties: {
      orderId: { type: 'string' }
    },
    required: ['orderId']
  },
  response: {
    200: {
      type: 'object',
      properties: orderProperties
    }
  }
};

const exportedSchemas = {
  createOrderSchema,
  getOrderSchema
};

Object.values(exportedSchemas).forEach(schema => schema.tags = ['order']);

module.exports = exportedSchemas;

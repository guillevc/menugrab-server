const {
  menuItemProperties,
  restaurantProperties
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
      properties: {
        orderId: { type: 'string' },
        date: { type: 'string' },
        restaurant: {
          type: 'object',
          properties: restaurantProperties
        },
        menuItems: {
          type: 'array',
          items: menuItemProperties
        }
      }
    }
  }
}

const exportedSchemas = {
  createOrderSchema,
  getOrderSchema
};

Object.values(exportedSchemas).forEach(schema => schema.tags = ['order']);

module.exports = exportedSchemas;

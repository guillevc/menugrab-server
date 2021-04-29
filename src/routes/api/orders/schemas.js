const { orderProperties } = require('../../../shared/properties');
const { OrderType, OrderState } = require('../../../shared/enums');

const createOrderSchema = {
  body: {
    type: 'object',
    properties: {
      restaurantId: { type: 'string' },
      orderType: {
        type: 'string',
        enum: Object.values(OrderType)
      },
      table: { type: 'number' },
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

const orderStateDTOProperties = {
  orderState: {
    type: 'string',
    enum: Object.values(OrderState)
  },
  completionDate: { type: 'string' }
};

const updateOrderStateSchema = {
  params: {
    type: 'object',
    properties: {
      id: { type: 'string' }
    },
    required: ['id']
  },
  body: {
    type: 'object',
    properties: orderStateDTOProperties,
    required: ['orderState']
  },
  response: {
    200: {
      type: 'object',
      properties: orderStateDTOProperties
    }
  },
  tags: ['orders']
};

module.exports = {
  createOrderSchema,
  getOrderSchema,
  updateOrderStateSchema
};

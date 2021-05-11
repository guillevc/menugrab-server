import { orderProperties } from '../../../shared/properties';
import { OrderType, OrderState } from '../../../shared/enums';

export const createOrderSchema = {
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

export const getOrderSchema = {
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

const updateOrderStateDTOProperties = {
  orderState: {
    type: 'string',
    enum: Object.values(OrderState)
  },
  completionDate: { type: 'string' }
};

export const updateOrderStateSchema = {
  params: {
    type: 'object',
    properties: {
      id: { type: 'string' }
    },
    required: ['id']
  },
  body: {
    type: 'object',
    properties: updateOrderStateDTOProperties,
    required: ['orderState']
  },
  response: {
    200: {
      type: 'object',
      properties: updateOrderStateDTOProperties
    }
  },
  tags: ['orders']
};

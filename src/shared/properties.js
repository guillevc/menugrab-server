import { OrderType, OrderState } from './enums';

export const coordinatesProperties = {
  latitude: { type: 'number' },
  longitude: { type: 'number' }
};

export const restaurantProperties = {
  id: { type: 'string' },
  name: { type: 'string' },
  imageURL: { type: 'string' },
  coordinates: {
    type: 'object',
    properties: coordinatesProperties
  },
  acceptingOrderTypes: {
    type: 'array',
    items: {
      type: 'string',
      enum: Object.values(OrderType)
    }
  },
  distance: { type: 'number' },
  address: { type: 'string' },
  isFeatured: {
    type: 'boolean',
    default: 'false'
  }
};

export const menuItemProperties = {
  id: { type: 'string' },
  name: { type: 'string' },
  description: { type: 'string' },
  price: { type: 'number' }
};

const orderItemProperties = {
  quantity: { type: 'number' },
  menuItems: {
    type: 'object',
    properties: menuItemProperties
  }
};

export const orderProperties = {
  id: { type: 'string' },
  date: { type: 'string' },
  orderType: {
    type: 'string',
    enum: Object.values(OrderType)
  },
  table: { type: 'number' },
  orderState: {
    type: 'string',
    enum: Object.values(OrderState)
  },
  completionDate: { type: 'string' },
  restaurant: {
    type: 'object',
    properties: restaurantProperties
  },
  orderItems: {
    type: 'array',
    items: orderItemProperties
  }
};

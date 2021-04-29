const { OrderType, OrderState } = require('./enums');

const coordinatesProperties = {
  latitude: { type: 'number' },
  longitude: { type: 'number' }
};

const restaurantProperties = {
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

const menuItemProperties = {
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

const orderProperties = {
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
  restaurant: {
    type: 'object',
    properties: restaurantProperties
  },
  orderItems: {
    type: 'array',
    items: orderItemProperties
  }
};

module.exports = {
  coordinatesProperties,
  restaurantProperties,
  menuItemProperties,
  orderProperties
};

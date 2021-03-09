const {
  coordinatesProperties,
  restaurantProperties,
  menuItemProperties
} = require('../shared/properties');

const getNearbyRestaurantsSchema = {
  querystring: {
    type: 'object',
    properties: coordinatesProperties
  },
  response: {
    200: {
      type: 'array',
      items: {
        type: 'object',
        properties: restaurantProperties
      }
    }
  },
  tags: ['restaurants']
};

const menuItemCategoryProperties = {
  name: { type: 'string' },
  menuItems: {
    type: 'array',
    properties: menuItemProperties
  }
};

const menuProperties = {
  menuItemCategories: {
    type: 'array',
    properties: menuItemCategoryProperties
  }
}

const getRestaurantMenuSchema = {
  params: {
    type: 'object',
    properties: {
      restaurantId: { type: 'string' }
    },
    required: ['restaurantId']
  },
  response: {
    200: {
      type: 'object',
      properties: menuProperties
    }
  },
  tags: ['restaurants']
};

module.exports = {
  getNearbyRestaurantsSchema,
  getRestaurantMenuSchema
};

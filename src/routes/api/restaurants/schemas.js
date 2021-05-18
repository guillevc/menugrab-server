const { OrderState } = require('../../../shared/enums');
const {
  coordinatesProperties,
  restaurantProperties,
  menuItemProperties,
  orderProperties
} = require('../../../shared/properties');

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

const getRestaurantSchema = {
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
      properties: restaurantProperties
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
};

const getRestaurantMenuSchema = {
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
      properties: menuProperties
    }
  },
  tags: ['restaurants']
};

const updateRestaurantMenuSchema = {
  params: {
    type: 'object',
    properties: {
      id: { type: 'string' }
    },
    required: ['id']
  },
  body: {
    type: 'object',
    properties: {
      menuProperties
    }
  },
  response: {
    200: {
      type: 'object',
      properties: menuProperties
    }
  },
  tags: ['restaurants']
};

const getRestaurantOrdersGroupedByStateSchema = {
  params: {
    type: 'object',
    properties: {
      id: { type: 'string' }
    },
    required: ['id']
  },
  response: {
    200: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          orderState: {
            type: 'string',
            enum: Object.values(OrderState)
          },
          orders: {
            type: 'array',
            items: {
              type: 'object',
              properties: orderProperties
            }
          }
        }
      }
    }
  },
  tags: ['restaurants', 'orders']
};

module.exports = {
  getNearbyRestaurantsSchema,
  getRestaurantSchema,
  getRestaurantMenuSchema,
  updateRestaurantMenuSchema,
  getRestaurantOrdersGroupedByStateSchema
};

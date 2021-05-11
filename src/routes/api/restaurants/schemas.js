import { OrderState } from '../../../shared/enums';
import {
  coordinatesProperties,
  restaurantProperties,
  menuItemProperties,
  orderProperties
} from '../../../shared/properties';

export const getNearbyRestaurantsSchema = {
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

export const getRestaurantSchema = {
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

export const getRestaurantMenuSchema = {
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

export const getRestaurantOrdersGroupedByStateSchema = {
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

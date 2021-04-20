const { orderProperties, restaurantProperties } = require('../../../shared/properties');

const getUserOrdersSchema = {
  params: {
    type: 'object',
    properties: {
      userId: { type: 'string' }
    },
    required: ['userId']
  },
  response: {
    200: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          ...orderProperties,
          restaurant: {
            type: 'object',
            properties: restaurantProperties
          }
        }
      }
    }
  },
  tags: ['users', 'orders']
};

const updateUserFCMTokenSchema = {
  params: {
    type: 'object',
    properties: {
      userId: { type: 'string' }
    },
    required: ['userId']
  },
  body: {
    type: 'object',
    properties: {
      fcmToken: {
        type: 'string'
      }
    },
    required: ['fcmToken']
  },
  tags: ['users']
};

module.exports = {
  getUserOrdersSchema,
  updateUserFCMTokenSchema
};

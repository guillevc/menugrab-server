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

const fcmTokenDTOProperties = {
  fcmToken: {
    type: 'string'
  }
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
    properties: fcmTokenDTOProperties,
    required: ['fcmToken']
  },
  response: {
    200: {
      properties: fcmTokenDTOProperties
    }
  },
  tags: ['users']
};

module.exports = {
  getUserOrdersSchema,
  updateUserFCMTokenSchema
};

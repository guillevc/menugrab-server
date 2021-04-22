const { orderProperties } = require('../../../shared/properties');

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
        properties: orderProperties
      }
    }
  },
  tags: ['users', 'orders']
};

const getCurrentOrderSchema = {
  params: {
    type: 'object',
    properties: {
      userId: { type: 'string' }
    },
    required: ['userId']
  },
  response: {
    200: {
      type: 'object',
      properties: orderProperties
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
  getCurrentOrderSchema,
  updateUserFCMTokenSchema
};

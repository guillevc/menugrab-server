import { orderProperties } from '../../../shared/properties';

export const getUserOrdersSchema = {
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
        properties: orderProperties
      }
    }
  },
  tags: ['users', 'orders']
};

export const getCurrentOrderSchema = {
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
  tags: ['users', 'orders']
};

const fcmTokenDTOProperties = {
  fcmToken: {
    type: 'string'
  }
};

export const updateUserFCMTokenSchema = {
  params: {
    type: 'object',
    properties: {
      id: { type: 'string' }
    },
    required: ['id']
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

const { orderProperties } = require('../shared/properties'); 

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

module.exports = {
  getUserOrdersSchema
};

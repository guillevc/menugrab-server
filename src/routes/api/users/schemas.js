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
  }
};

const exportedSchemas = {
  getUserOrdersSchema
};

Object.values(exportedSchemas).forEach(schema => schema.tags = ['user']);

module.exports = exportedSchemas;


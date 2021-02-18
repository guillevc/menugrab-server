const { restaurantProperties, menuItemProperties } = require('../shared/properties'); 

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
          restaurant: {
            type: 'object',
            properties: restaurantProperties
          },
          menuItems: {
            type: 'array',
            properties: menuItemProperties
          }
        }
      }
    }
  }
};

const exportedSchemas = {
  getUserOrdersSchema
};

Object.values(exportedSchemas).forEach(schema => schema.tags = ['user']);

module.exports = exportedSchemas;


const tags = ['restaurant'];

const restaurantProperties = {
  id: { type: 'string' },
  name: { type: 'string' }
};

const getAllSchema = {
  querystring: {
    type: 'object',
    properties: {
      latitude: { type: 'number' },
      longitude: { type: 'number' }
    }
  },
  response: {
    200: {
      type: 'array',
      items: {
        type: 'object',
        properties: restaurantProperties
      }
    }
  }
};

const exportedSchemas = {
  getAllSchema
};

Object.values(exportedSchemas).forEach(schema => schema.tags = tags);

module.exports = exportedSchemas;

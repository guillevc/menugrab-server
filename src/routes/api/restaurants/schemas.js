const coordinatesProperties = {
  latitude: { type: 'number' },
  longitude: { type: 'number' }
};

const restaurantProperties = {
  id: { type: 'string' },
  name: { type: 'string' },
  imageURL: { type: 'string' },
  coordinates: {
    type: 'object',
    properties: coordinatesProperties
  },
  acceptingOrderTypes: {
    type: 'array',
    items: { type: 'string' }
  }
};

const getNearbySchema = {
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
  }
};

const exportedSchemas = {
  getNearbySchema
};

Object.values(exportedSchemas).forEach(schema => schema.tags = ['restaurant']);

module.exports = exportedSchemas;

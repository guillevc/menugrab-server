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

const getNearbyRestaurantsSchema = {
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

const menuItemProperties = {
  id: { type: 'string' },
  name: { type: 'string' },
  description: { type: 'string' },
  price: { type: 'number' }
};

const menuItemCategoryProperties = {
  name: { type: 'string' },
  menuItems: {
    type: 'array',
    properties: menuItemProperties
  }
};

const getRestaurantMenuSchema = {
  params: {
    type: 'object',
    properties: {
      restaurantId: { type: 'string' }
    },
    required: ['restaurantId']
  },
  response: {
    200: {
      type: 'array',
      items: {
        type: 'object',
        properties: menuItemCategoryProperties
      }
    }
  }
};

const exportedSchemas = {
  getNearbyRestaurantsSchema,
  getRestaurantMenuSchema
};

Object.values(exportedSchemas).forEach(schema => schema.tags = ['restaurant']);

module.exports = exportedSchemas;

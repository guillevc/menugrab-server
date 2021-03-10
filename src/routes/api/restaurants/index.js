const {
  getNearbyRestaurantsSchema,
  getRestaurantMenuSchema
} = require('./schemas');

const routes = async (app, options) => {
  // getNearbyRestaurants
  app.get('/', { schema: getNearbyRestaurantsSchema }, async (req, reply) => {
    const { latitude, longitude } = req.query;
    return await app.restaurantsService.findAllNearby(latitude, longitude);
  });

  // getRestaurantMenu
  app.get('/:restaurantId/menu', { schema: getRestaurantMenuSchema }, async (req, reply) => {
    const { restaurantId } = req.params;
    return await app.restaurantsService.findMenu(restaurantId)
  });
};

module.exports = routes;

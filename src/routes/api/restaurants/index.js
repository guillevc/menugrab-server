const {
  getNearbyRestaurantsSchema,
  getRestaurantSchema,
  getRestaurantMenuSchema
} = require('./schemas');

const routes = async (app, _options) => {
  // getNearbyRestaurants
  app.get('/', { schema: getNearbyRestaurantsSchema }, async (req, _reply) => {
    const { latitude, longitude } = req.query;
    return app.restaurantsService.findAllNearby(latitude, longitude);
  });

  // getRestaurant
  app.get('/:id', { schema: getRestaurantSchema }, async (req, _reply) => {
    const { id } = req.params;
    return app.restaurantsService.findOne(id);
  });

  // getRestaurantMenu
  app.get('/:restaurantId/menu', { schema: getRestaurantMenuSchema }, async (req, _reply) => {
    const { restaurantId } = req.params;
    return app.restaurantsService.findMenu(restaurantId);
  });
};

module.exports = routes;

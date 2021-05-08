const {
  getNearbyRestaurantsSchema,
  getRestaurantSchema,
  getRestaurantMenuSchema,
  getRestaurantOrdersGroupedByStateSchema
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
  app.get('/:id/menu', { schema: getRestaurantMenuSchema }, async (req, _reply) => {
    const { id } = req.params;
    return app.restaurantsService.findMenu(id);
  });

  // getRestaurantOrdersGroupedByState
  app.get('/:id/orders', { schema: getRestaurantOrdersGroupedByStateSchema }, async (req, _reply) => {
    const { id } = req.params;
    return app.ordersService.findRecentOrdersByRestaurantGroupedByState(id);
  });
};

module.exports = routes;

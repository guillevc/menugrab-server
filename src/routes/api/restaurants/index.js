const {
  getNearbyRestaurantsSchema,
  getRestaurantSchema,
  updateRestaurantSchema,
  updateRestaurantMenuSchema,
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

  // updateRestaurant
  app.put('/:id', { schema: updateRestaurantSchema }, async (req, _reply) => {
    const { id } = req.params;
    const newRestaurant = req.body;
    return app.restaurantsService.update(id, newRestaurant);
  });

  // getRestaurantMenu
  app.get('/:id/menu', { schema: getRestaurantMenuSchema }, async (req, _reply) => {
    const { id } = req.params;
    return app.restaurantsService.findMenu(id);
  });

  // updateRestaurantMenu
  app.put('/:id/menu', { schema: updateRestaurantMenuSchema }, async (req, _reply) => {
    const { id } = req.params;
    const menu = req.body;
    return app.restaurantsService.updateMenu(id, menu);
  });

  // getRestaurantOrdersGroupedByState
  app.get('/:id/orders/by-state', { schema: getRestaurantOrdersGroupedByStateSchema }, async (req, _reply) => {
    const { id } = req.params;
    return app.ordersService.findOrdersByRestaurantGroupedByState(id);
  });
};

module.exports = routes;

const { RestaurantsService } = require('../../../services/restaurants');
const {
  getNearbyRestaurantsSchema,
  getRestaurantMenuSchema
} = require('./schemas');

const routes = async (app, options) => {
  const restaurantsService = new RestaurantsService(app);

  // getNearbyRestaurants
  app.get('/', { schema: getNearbyRestaurantsSchema }, async (req, reply) => {
    const { latitude, longitude } = req.query;
    return await restaurantsService.findAllNearby(latitude, longitude);
  });

  // getRestaurantMenu
  app.get('/:restaurantId/menu', { schema: getRestaurantMenuSchema }, async (req, reply) => {
    const { restaurantId } = req.params;
    return await restaurantsService.findMenu(restaurantId)
  });
};

module.exports = routes;

const { OrdersService } = require('../../../services/orders');
const { getUserOrdersSchema } = require('./schemas');

const routes = async (app, options) => {
  const ordersService = new OrdersService(app);

  // getUserOrders
  app.get('/:userId/orders', { schema: getUserOrdersSchema/*, preValidation: [app.requireFirebaseAuth] */ }, async (req, reply) => {
    const { userId } = req.params;

    if (userId !== app.user?.uid) {
      throw app.httpErrors.forbidden();
    }

    return await ordersService.getAllByUser(userId);
  });
};

module.exports = routes;

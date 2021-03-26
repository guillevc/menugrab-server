const { getUserOrdersSchema } = require('./schemas');

const routes = async (app, _options) => {
  // getUserOrders
  app.get('/:userId/orders', { schema: getUserOrdersSchema, preValidation: [app.requireFirebaseAuth] }, async (req, _reply) => {
    const { userId } = req.params;

    if (userId !== req.user?.uid) {
      throw app.httpErrors.forbidden();
    }

    return app.ordersService.findAllByUser(userId);
  });
};

module.exports = routes;

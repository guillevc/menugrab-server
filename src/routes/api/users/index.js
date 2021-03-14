const { getUserOrdersSchema } = require('./schemas');

const routes = async (app, options) => {
  // getUserOrders
  app.get('/:userId/orders', { schema: getUserOrdersSchema, preValidation: [app.requireFirebaseAuth] }, async (req, reply) => {
    const { userId } = req.params;

    if (userId !== req.user?.uid) {
      throw app.httpErrors.forbidden();
    }

    return await app.ordersService.findAllByUser(userId);
  });
};

module.exports = routes;

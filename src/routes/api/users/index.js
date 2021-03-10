const { getUserOrdersSchema } = require('./schemas');

const routes = async (app, options) => {
  // getUserOrders
  app.get('/:userId/orders', { schema: getUserOrdersSchema/*, preValidation: [app.requireFirebaseAuth] */ }, async (req, reply) => {
    const { userId } = req.params;

    // if (userId !== app.user?.uid) {
    //   throw app.httpErrors.forbidden();
    // }

    return await app.ordersService.getAllByUser(userId);
  });
};

module.exports = routes;

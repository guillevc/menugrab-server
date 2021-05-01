const { getUserOrdersSchema, getCurrentOrderSchema, updateUserFCMTokenSchema } = require('./schemas');

const routes = async (app, _options) => {
  // getUserOrders
  app.get('/:id/orders', { schema: getUserOrdersSchema, preValidation: [app.requireFirebaseAuth] }, async (req, _reply) => {
    const { id } = req.params;

    if (id !== req.user?.uid) {
      throw app.httpErrors.forbidden();
    }

    return app.ordersService.findAllByUser(id);
  });

  // getCurrentOrder
  app.get('/:id/current-order', { schema: getCurrentOrderSchema, preValidation: [app.requireFirebaseAuth] }, async (req, _reply) => {
    const { id } = req.params;

    if (id !== req.user?.uid) {
      throw app.httpErrors.forbidden();
    }

    return app.ordersService.findCurrentOrderByUser(id);
  });

  // updateUserFCMToken
  app.put('/:id/fcm-token', { schema: updateUserFCMTokenSchema, preValidation: [app.requireFirebaseAuth] }, async (req, _reply) => {
    const { id } = req.params;
    const { fcmToken } = req.body;

    if (id !== req.user?.uid) {
      throw app.httpErrors.forbidden();
    }

    return app.usersService.updateFCMToken(id, fcmToken);
  });
};

module.exports = routes;

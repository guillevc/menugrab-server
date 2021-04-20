const { getUserOrdersSchema, updateUserFCMTokenSchema } = require('./schemas');

const routes = async (app, _options) => {
  // getUserOrders
  app.get('/:userId/orders', { schema: getUserOrdersSchema, preValidation: [app.requireFirebaseAuth] }, async (req, _reply) => {
    const { userId } = req.params;

    if (userId !== req.user?.uid) {
      throw app.httpErrors.forbidden();
    }

    return app.ordersService.findAllByUser(userId);
  });

  // updateUserFCMToken
  app.put('/:userId/fcm-token', { schema: updateUserFCMTokenSchema, preValidation: [app.requireFirebaseAuth] }, async (req, _reply) => {
    const { userId } = req.params;
    const { fcmToken } = req.body;

    if (userId !== req.user?.uid) {
      throw app.httpErrors.forbidden();
    }

    return app.usersService.updateFCMToken(userId, fcmToken);
  });
};

module.exports = routes;

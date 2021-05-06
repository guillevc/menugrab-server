const {
  createOrderSchema,
  getOrderSchema,
  updateOrderStateSchema
} = require('./schemas');

const routes = async (app, _options) => {
  // createOrder
  app.post('/', { schema: createOrderSchema, preValidation: [app.requireFirebaseAuth] }, async (req, _reply) => {
    const userId = req.user?.uid;
    const createOrderDTO = req.body;
    const newOrderId = await app.ordersService.create(createOrderDTO, userId);
    // TODO: check authorization
    return app.ordersService.findOne(newOrderId);
  });

  // getOrder
  app.get('/:id', { schema: getOrderSchema, preValidation: [app.requireFirebaseAuth] }, async (req, _reply) => {
    const userId = req.user?.uid;
    const { id: orderId } = req.params;
    return app.ordersService.findOne(orderId, userId);
  });

  // updateOrderState
  app.put('/:id/state', { schema: updateOrderStateSchema }, async (req, _reply) => {
    const { id: orderId } = req.params;
    const { orderState, completionDate: completionDateAsISOStringWithoutMillis } = req.body;

    const { userId, restaurant } = await app.ordersService.findOne(orderId);
    const response = await app.ordersService.updateOrderState(orderId, orderState, completionDateAsISOStringWithoutMillis);
    app.pushNotificationsService.notifyOrderStateUpdate(userId, orderId, orderState, completionDateAsISOStringWithoutMillis, restaurant.name);
    return response;
  });
};

module.exports = routes;

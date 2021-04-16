const { OrderType } = require('../../../shared/enums');
const {
  createOrderSchema,
  getOrderSchema
} = require('./schemas');

const routes = async (app, _options) => {
  // createOrder
  app.post('/', { schema: createOrderSchema, preValidation: [app.requireFirebaseAuth] }, async (req, _reply) => {
    const userId = req.user?.uid;

    // TODO: move check to service
    const createOrder = req.body;
    if (createOrder.orderType === OrderType.table && !createOrder.table) {
      throw app.httpErrors.badRequest('expected `table` in the request');
    }

    const newOrderId = await app.ordersService.create(createOrder, userId);
    return app.ordersService.findOne(newOrderId);
  });

  // getOrder
  app.get('/:id', { schema: getOrderSchema }, async (req, _reply) => {
    const { id } = req.params;
    return app.ordersService.findOne(id);
  });
};

module.exports = routes;

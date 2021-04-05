const {
  createOrderSchema,
  getOrderSchema
} = require('./schemas');

const routes = async (app, _options) => {
  // createOrder
  app.post('/', { schema: createOrderSchema, preValidation: [app.requireFirebaseAuth] }, async (req, _reply) => {
    const userId = req.user?.uid;
    const newOrderId = await app.ordersService.create(req.body, userId);
    return app.ordersService.findOne(newOrderId);
  });

  // getOrder
  app.get('/:id', { schema: getOrderSchema }, async (req, _reply) => {
    const { id } = req.params;
    return app.ordersService.findOne(id);
  });
};

module.exports = routes;

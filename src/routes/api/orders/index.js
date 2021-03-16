const {
  createOrderSchema,
  getOrderSchema
} = require('./schemas');

const routes = async (app, options) => {
  // createOrder
  app.post('/', { schema: createOrderSchema, preValidation: [app.requireFirebaseAuth] }, async (req, reply) => {
    const userId = req.user?.uid;
    return await app.ordersService.create(req.body, userId);
  });

  // getOrder
  app.get('/:id', { schema: getOrderSchema }, async (req, reply) => {
    const { id } = req.params;
    return await app.ordersService.findOne(id);
  });
};

module.exports = routes;

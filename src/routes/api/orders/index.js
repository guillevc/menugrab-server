const {
  createOrderSchema,
  getOrderSchema
} = require('./schemas');

const routes = async (app, options) => {
  // createOrder
  app.post('/', { schema: createOrderSchema, preValidation: [app.requireFirebaseAuth] }, async (req, reply) => {
    const { userId } = req.params;
    return await app.orderService.create(req.body, userId);
  });

  // getOrder
  app.get('/:id', { schema: getOrderSchema }, async (req, reply) => {
    const { id } = req.params;
    return await app.orderService.findOne(id);
  });

};

module.exports = routes;

const firebase = require('firebase-admin');
const { OrdersService } = require('../../../services/orders');
const {
  createOrderSchema,
  getOrderSchema
} = require('./schemas');

const routes = async (app, options) => {
  const orderService = new OrdersService(app)

  // createOrder
  app.post('/', { schema: createOrderSchema/*, preValidation: [app.requireFirebaseAuth] */}, async (req, reply) => {
    const { userId } = req.params;
    return await orderService.create(req.body, userId)
  });

  // getOrder
  app.get('/:orderId', { schema: getOrderSchema }, async (req, reply) => {
    const { orderId } = req.params;
    return await orderService.getOne(orderId)
  });

};

module.exports = routes;

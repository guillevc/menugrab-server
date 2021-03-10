const Fastify = require('fastify');

// Loading order of your plugins
// └── plugins (from the Fastify ecosystem)
// └── your plugins (your custom plugins)
// └── decorators
// └── hooks
// └── your services

const start = async () => {
  const app = Fastify({
    logger: { prettyPrint: true }
  });

  // fastify plugins
  await app.register(require('fastify-sensible'));
  await app.register(require('fastify-env'), {
    confKey: 'env',
    dotenv: 'true',
    schema: {
      type: 'object',
      properties: {
        FIREBASE_CERT_FILE_BASE64: { type: 'string' },
        PORT: { type: 'number' }
      },
      required: ['FIREBASE_CERT_FILE_BASE64']
    }
  });
  await app.register(require('fastify-cors'));
  await app.register(require('fastify-swagger'), require('./swagger-config'));
  await app.register(require('@now-ims/fastify-firebase'), {
    cert: JSON.parse(Buffer.from(app.env.FIREBASE_CERT_FILE_BASE64, 'base64').toString('ascii'))
  });

  // inject/decorate with persistance services
  const RestaurantsService = require('./services/restaurants');
  await app.decorate('restaurantsService', new RestaurantsService(app));
  const OrdersService = require('./services/orders');
  await app.decorate('ordersService', new OrdersService(app));

  // custom plugins
  await app.register(require('./plugins/firebase-auth-plugin'));

  // routes service
  await app.register(require('./routes/api'), { prefix: 'api' });

  try {
    await app.listen(app.env.PORT || 3000, '0.0.0.0');
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

start();

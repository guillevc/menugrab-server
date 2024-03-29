const Fastify = require('fastify');

// Loading order of your plugins
// └── plugins (from the Fastify ecosystem)
// └── your plugins (your custom plugins)
// └── decorators
// └── hooks
// └── your services

const buildApp = async () => {
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
        PORT: {
          type: 'number',
          default: 3000
        }
      }
    }
  });
  await app.register(require('fastify-cors'));
  await app.register(require('fastify-healthcheck'));
  await app.register(require('fastify-swagger'), require('./swagger-config'));
  if (app.env.FIREBASE_CERT_FILE_BASE64) {
    await app.register(require('@now-ims/fastify-firebase'), {
      cert: JSON.parse(Buffer.from(app.env.FIREBASE_CERT_FILE_BASE64, 'base64').toString('ascii'))
    });
    app.firebase.firestore().settings({ ignoreUndefinedProperties: true });
  } else {
    throw Error('Missing Firebase cert file')
  }

  // inject/decorate with persistance services
  const RestaurantsService = require('./services/restaurants');
  await app.decorate('restaurantsService', new RestaurantsService(app));
  const OrdersService = require('./services/orders');
  await app.decorate('ordersService', new OrdersService(app));
  const UsersService = require('./services/users');
  await app.decorate('usersService', new UsersService(app));
  const PushNotificationsService = require('./services/push-notifications');
  await app.decorate('pushNotificationsService', new PushNotificationsService(app));

  // custom plugins
  await app.register(require('./plugins/firebase-auth-plugin'));

  // routes service
  await app.register(require('./routes/api'), { prefix: 'api' });

  return app;
};

module.exports = { buildApp };

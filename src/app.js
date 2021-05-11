import Fastify from 'fastify';

// Loading order of your plugins
// └── plugins (from the Fastify ecosystem)
// └── your plugins (your custom plugins)
// └── decorators
// └── hooks
// └── your services

export default async () => {
  const app = Fastify({
    logger: { prettyPrint: true }
  });

  // fastify plugins
  await app.register(import('fastify-sensible'));
  await app.register(import('fastify-env'), {
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
  await app.register(import('fastify-cors'));
  await app.register(import('fastify-healthcheck'));
  await app.register(import('fastify-swagger'), import('./swagger-config'));
  if (app.env.FIREBASE_CERT_FILE_BASE64) {
    await app.register(import('@now-ims/fastify-firebase'), {
      cert: JSON.parse(Buffer.from(app.env.FIREBASE_CERT_FILE_BASE64, 'base64').toString('ascii'))
    });
    app.firebase.firestore().settings({ ignoreUndefinedProperties: true });
  }

  // inject/decorate with persistance services
  const RestaurantsService = (await import('./services/restaurants')).default;
  await app.decorate('restaurantsService', new RestaurantsService(app));
  const OrdersService = (await import('./services/orders')).default;
  await app.decorate('ordersService', new OrdersService(app));
  const UsersService = (await import('./services/users')).default;
  await app.decorate('usersService', new UsersService(app));
  const PushNotificationsService = (await import('./services/push-notifications')).default;
  await app.decorate('pushNotificationsService', new PushNotificationsService(app));

  // custom plugins
  await app.register(import('./plugins/firebase-auth-plugin'));

  // routes service
  const routes = (await import('./routes/api')).default;
  console.log(routes);
  await app.register(routes, { prefix: 'api' });

  return app;
};

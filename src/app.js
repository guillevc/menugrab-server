const Fastify = require('fastify');
const APP_PORT = 3000;

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
  await app.register(require('fastify-env'), {
    confKey: 'env',
    dotenv: 'true',
    schema: {
      type: 'object',
      properties: {
        FIREBASE_CERT_PATH: { type: 'string' }
      }
    }
  });
  await app.register(require('fastify-cors'));
  await app.register(require('fastify-swagger'), require('./swagger-config'));
  await app.register(require('@now-ims/fastify-firebase'), {
    cert: app.env.FIREBASE_CERT_PATH
  });

  // custom plugins
  await app.register(require('./routes/api'), { prefix: 'api' });

  try {
    await app.listen(APP_PORT);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

start();

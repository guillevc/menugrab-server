const swagger = require('fastify-swagger');
const swaggerConfig = require('../swagger-config');

const apiRoutes = async (app, options) => {
  app.register(swagger, swaggerConfig);
  app.register(require('./restaurants'), { prefix: 'restaurants' });
  app.get('/health', async (request, reply) => {
    return { hello: 'world' };
  });
};

module.exports = apiRoutes;

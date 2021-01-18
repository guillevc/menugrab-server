const apiRoutes = async (app, options) => {
  app.register(require('./auth'), { prefix: 'auth' });
  app.register(require('./restaurants'), { prefix: 'restaurants' });
  app.get('/health', async (request, reply) => {
    return { hello: 'world' };
  });
};

module.exports = apiRoutes;

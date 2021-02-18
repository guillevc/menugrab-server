const apiRoutes = async (app, options) => {
  app.register(require('./restaurants'), { prefix: 'restaurants' });
  app.register(require('./orders'), { prefix: 'orders' });
  app.register(require('./users'), { prefix: 'users' });
};

module.exports = apiRoutes;

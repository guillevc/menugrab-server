const { getAllSchema } = require('./schemas');

const routes = async (app, options) => {

  // getAll
  app.get('/', { schema: getAllSchema }, async (request, reply) => {
    return [];
  })

};

module.exports = routes;

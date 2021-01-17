const { getAllSchema } = require('./schemas');

async function routes(fastify, options) {

  // getAll
  fastify.get('/', { schema: getAllSchema }, async (request, reply) => {
    return [];
  })

}

module.exports = routes

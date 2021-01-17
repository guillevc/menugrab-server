module.exports = {
  routePrefix: '/docs',
  exposeRoute: true,
  swagger: {
    info: {
      title: 'menugrab API',
      description: 'docs',
      version: '0.1.0'
    },
    externalDocs: {
      url: 'https://swagger.io',
      description: 'Find more info here'
    },
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
      { name: 'user', description: 'User related end-points' },
      { name: 'restaurant', description: 'Restaurant related end-points' }
    ]
  }
};

export default {
  routePrefix: '/docs',
  exposeRoute: true,
  swagger: {
    info: {
      title: 'Menugrab API',
      description: '',
      version: '0.1.0'
    },
    externalDocs: {
      url: 'https://swagger.io',
      description: 'Find more info here'
    },
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
      { name: 'users', description: 'User related end-points' },
      { name: 'restaurants', description: 'Restaurant related end-points' },
      { name: 'orders', description: 'Order related end-points' }
    ]
  }
};

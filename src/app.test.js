const { test } = require('tap');
const { buildApp } = require('./app')

test('healthcheck', async t => {
  const app = await buildApp();
  const response = await app.inject({
    method: 'GET',
    url: '/health'
  });

  t.strictEqual(response.statusCode, 200, 'returns a status code of 200')
});

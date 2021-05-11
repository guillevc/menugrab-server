import { test } from 'tap';
import buildApp from './app';

test('healthcheck', async (t) => {
  const app = await buildApp();
  const response = await app.inject({
    method: 'GET',
    url: '/health'
  });

  t.equal(response.statusCode, 200, 'returns a status code of 200');
});

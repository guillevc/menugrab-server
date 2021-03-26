const fp = require('fastify-plugin');

function parseAuthorizationBearer(request) {
  const components = request.headers.authorization?.split(' ');
  if (components?.length === 2 && components[0] === 'Bearer') {
    return components[1];
  }
  return null;
}

const plugin = async (app, _options, _next) => {
  app.decorateRequest('user', null);

  app.decorate('requireFirebaseAuth', async (request, reply, done) => {
    const idToken = parseAuthorizationBearer(request);
    if (!idToken) {
      done(app.httpErrors.unauthorized());
    }

    let decodedToken;
    try {
      decodedToken = await app.firebase.auth().verifyIdToken(idToken);
    } catch (error) {
      done(app.httpErrors.unauthorized(error.message));
    }

    request.user = decodedToken;
  });
};

module.exports = fp(plugin);

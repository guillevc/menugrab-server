const fp = require('fastify-plugin');

function parseAuthorizationBearer(request) {
  const components = request.headers.authorization?.split(' ');
  if (components?.length === 2 && components[0] === 'Bearer') {
    return components[1];
  }
}

const plugin = async (app, options, next) => {
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

    console.log("idToken", idToken);
    // console.log("decodedToken.uid", decodedToken.uid);

    request.user = decodedToken;
  });
};

module.exports = fp(plugin);

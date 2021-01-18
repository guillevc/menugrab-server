const authSchema = {
};

const routes = async (app, options) => {

  app.get('/verify', { preValidation: [app.requireFirebaseAuth] }, async (request, reply) => {
    return request.user;
  });

};

module.exports = routes;

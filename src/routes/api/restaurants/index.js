const { getNearbySchema } = require('./schemas');

const routes = async (app, options) => {

  // getNearby
  app.get('/', { schema: getNearbySchema }, async (req, reply) => {
    const lat = req.query.latitude;
    const long = req.query.longitude;

    if (lat && long) {
      // TODO: find nearby
    }

    const restaurantsRef =  app.firebase.firestore().collection('restaurants');
    const restaurantsSnapshot = await restaurantsRef.get();
    return restaurantsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  });

};

module.exports = routes;

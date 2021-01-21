const {
  getNearbyRestaurantsSchema,
  getRestaurantMenuSchema
} = require('./schemas');

const routes = async (app, options) => {

  // getNearbyRestaurants
  app.get('/', { schema: getNearbyRestaurantsSchema }, async (req, reply) => {
    const lat = req.query.latitude;
    const long = req.query.longitude;

    if (lat && long) {
      // TODO: find nearby
    }

    const restaurantsRef =  app.firebase.firestore().collection('restaurants');
    const restaurantsSnapshot = await restaurantsRef.get();
    return restaurantsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  });

  // getRestaurantMenu
  app.get('/:restaurantId/menu', { schema: getRestaurantMenuSchema }, async (req, reply) => {
    const { restaurantId } = req.params;

    const categoriesRef =  app.firebase.firestore().collection('restaurants').doc(restaurantId).collection('menuItemCategories');
    const categoriesSnapshot = await categoriesRef.get();

    if (categoriesSnapshot.docs?.length === 0) {
      throw app.httpErrors.notFound();
    }

    let menuItemCategories = [];
    await categoriesSnapshot.docs.reduce(async (memo, categoryDoc) => {
      await memo;

      const categoryName = categoryDoc.data().name;

      const menuItemsRef = categoriesRef.doc(categoryDoc.id).collection('menuItems');
      const menuItemsSnapshot = await menuItemsRef.get();
      const menuItems = menuItemsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      menuItemCategories.push({ name: categoryName, menuItems });
    }, undefined);

    return { menuItemCategories };
  });

};

module.exports = routes;

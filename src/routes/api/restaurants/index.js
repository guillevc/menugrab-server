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

    let categories = [];
    await categoriesSnapshot.docs.reduce(async (memo, categoryDoc) => {
      await memo;
      const categoryName = categoryDoc.data().name;
      const menuItemsRef = categoriesRef.doc(categoryDoc.id).collection('menuItems');
      const menuItemsSnapshot = await menuItemsRef.get();

      let items = []
      menuItemsSnapshot.docs.forEach(menuItemDoc => {
        items.push({ id: menuItemDoc.id, ...menuItemDoc.data() });
      });

      categories.push({ name: categoryName, menuItems: items });
    }, undefined);

    return categories;
  });

};

module.exports = routes;

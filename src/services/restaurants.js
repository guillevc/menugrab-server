const { getDistance } = require('../shared/distance');

class RestaurantsService {
  constructor(app) {
    this.app = app;
  }

  async findOne(restaurantId) {
    const restaurantSnapshot = this.app.firebase.firestore().collection('restaurants').doc(restaurantId);
    const restaurantDoc = await restaurantSnapshot.get();
    return {
      id: restaurantDoc.id,
      ...restaurantDoc.data()
    };
  }

  async findAllNearby(lat, long) {
    const restaurantsSnapshot = await this.app.firebase.firestore().collection('restaurants').get();
    return restaurantsSnapshot.docs.map(doc => {
      const restaurant = { id: doc.id, ...doc.data() };
      if (lat && long) {
        restaurant.distance = getDistance(lat, long, restaurant.coordinates.latitude, restaurant.coordinates.longitude);
      }
      return restaurant;
    });
  }

  async findMenu(restaurantId) {
    const categoriesRef = this.app.firebase.firestore().collection('restaurants').doc(restaurantId).collection('menuItemCategories');
    const categoriesSnapshot = await categoriesRef.get();

    if (categoriesSnapshot.docs?.length === 0) {
      throw this.app.httpErrors.notFound();
    }

    const menuItemCategories = [];
    await categoriesSnapshot.docs.reduce(async (memo, categoryDoc) => {
      await memo;

      const categoryName = categoryDoc.data().name;

      const menuItemsRef = categoriesRef.doc(categoryDoc.id).collection('menuItems');
      const menuItemsSnapshot = await menuItemsRef.get();
      const menuItems = menuItemsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      menuItemCategories.push({ name: categoryName, menuItems });
    }, undefined);

    return { menuItemCategories };
  }
}

module.exports = RestaurantsService;

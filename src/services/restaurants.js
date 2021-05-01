const { getDistance } = require('../shared/distance');

class RestaurantsService {
  constructor(app) {
    this.app = app;
  }

  async findOne(id) {
    const restaurantSnapshot = this.app.firebase.firestore().collection('restaurants').doc(id);
    const restaurantDoc = await restaurantSnapshot.get();

    if (!restaurantDoc.exists) {
      throw this.app.httpErrors.notFound(`Restaurant with id ${id} not found`);
    }
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
    const categoriesSnapshot = await categoriesRef.orderBy('order').get();

    if (categoriesSnapshot.docs?.length === 0) {
      throw this.app.httpErrors.notFound(`Menu not found for restaurant with id ${restaurantId}`);
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

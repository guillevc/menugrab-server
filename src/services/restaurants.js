const { getDistance } = require('../shared/distance');
const { coordinatesToGeoPoint } = require('../shared/geopoint');

class RestaurantsService {
  constructor(app) {
    this.app = app;
  }

  async findOne(id) {
    const restaurantDoc = await this.app.firebase.firestore().collection('restaurants').doc(id).get();

    if (!restaurantDoc.exists) {
      throw this.app.httpErrors.notFound(`Restaurant with id ${id} not found`);
    }
    return {
      id: restaurantDoc.id,
      ...restaurantDoc.data()
    };
  }

  async update(id, newRestaurant) {
    const restaurantRef = await this.app.firebase.firestore().collection('restaurants').doc(id);
    const newRestaurantData = { ...newRestaurant };
    delete newRestaurantData.id;
    if (newRestaurantData.coordinates) {
      newRestaurantData.coordinates = coordinatesToGeoPoint(newRestaurantData.coordinates);
    }
    return restaurantRef.set(newRestaurantData, { merge: true });
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

  async updateMenu(restaurantId, newMenu) {
    const categoriesSubcollectionRef = this.app.firebase.firestore().collection('restaurants').doc(restaurantId).collection('menuItemCategories');

    await this.app.firebase.firestore().runTransaction(async (t) => {
      // Delete menu
      const categoriesSnapshot = await t.get(categoriesSubcollectionRef);
      const categoriesRefs = categoriesSnapshot.docs.reduce((acc, doc) => [...acc, doc.ref], []);

      const menuItemsRefs = [];
      await categoriesRefs.reduce(async (memo, categoryRef) => {
        await memo;
        const categoryMenuItemsSubcollectionRef = categoryRef.collection('menuItems');
        const categoryMenuItemsSnapshot = await t.get(categoryMenuItemsSubcollectionRef);
        categoryMenuItemsSnapshot.docs.forEach((doc) => {
          menuItemsRefs.push(doc.ref);
        });
      }, undefined);

      [...menuItemsRefs, ...categoriesRefs].forEach(ref => {
        t.delete(ref);
      });

      // Add new menu
      await newMenu.menuItemCategories.reduce(async (categoryMemo, category, index) => {
        await categoryMemo;
        const newCategoryData = {
          name: category.name,
          order: index
        };
        const newCategoryRef = await categoriesSubcollectionRef.doc();
        t.set(newCategoryRef, newCategoryData);

        const categoryMenuItemsSubcollectionRef = newCategoryRef.collection('menuItems');
        await category.menuItems.reduce(async (menuItemMemo, menuItem) => {
          await menuItemMemo;
          const newMenuItemRef = await categoryMenuItemsSubcollectionRef.doc();
          const newMenuItemData = {
            id: newMenuItemRef.id,
            name: menuItem.name,
            description: menuItem.description,
            price: menuItem.price
          };
          await t.set(newMenuItemRef, newMenuItemData);
        }, undefined);
      }, undefined);
    });

    // Return updated menu data
    return this.findMenu(restaurantId);
  }
}

module.exports = RestaurantsService;

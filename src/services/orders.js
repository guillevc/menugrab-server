const { firestore } = require('firebase-admin');
const { OrderState } = require('../shared/enums');
const { timestampToISOStringWithoutMillis } = require('../shared/date');

class OrdersService {
  constructor(app) {
    this.app = app;
  }

  async create(order, userId) {
    const menuItemsRef = this.app.firebase.firestore().collectionGroup('menuItems');
    const orderItems = [];
    await order.items.reduce(async (acc, reqMenuItem) => {
      const fetchedMenuItem = await menuItemsRef.where('id', '==', reqMenuItem.menuItemId).limit(1).get();
      const fetchedMenuItemDoc = fetchedMenuItem.docs[0];
      if (fetchedMenuItemDoc) {
        return orderItems.push({
          quantity: reqMenuItem.quantity,
          menuItem: {
            id: fetchedMenuItemDoc.id,
            ...fetchedMenuItemDoc.data()
          }
        });
      }
      return acc;
    }, undefined);

    const ordersRef = this.app.firebase.firestore().collection('orders');
    const newOrderData = {
      userId,
      restaurantId: order.restaurantId,
      orderType: order.orderType,
      table: order.table,
      orderItems,
      date: firestore.Timestamp.now(),
      orderState: OrderState.completed
    };
    const newOrderDoc = await ordersRef.add(newOrderData);
    return newOrderDoc.id;
  }

  async findOne(id) {
    const orderSnapshot = this.app.firebase.firestore().collection('orders').doc(id);
    const orderDoc = await orderSnapshot.get();
    const order = {
      id: orderDoc.id,
      ...orderDoc.data()
    };
    order.date = timestampToISOStringWithoutMillis(order.date);
    order.restaurant = await this.app.restaurantsService.findOne(order.restaurantId);
    return order;
  }

  async findAllByUser(userId) {
    const ordersRef = this.app.firebase.firestore().collection('orders');
    const ordersSnapshot = await ordersRef.where('userId', '==', userId).orderBy('date', 'desc').get();
    const ordersWithRestaurant = [];
    await ordersSnapshot.docs.reduce(async (memo, orderDoc) => {
      await memo;
      const order = {
        id: orderDoc.id,
        ...orderDoc.data()
      };
      order.date = timestampToISOStringWithoutMillis(order.date);
      const restaurant = await this.app.restaurantsService.findOne(order.restaurantId);
      if (restaurant) {
        ordersWithRestaurant.push({
          ...order,
          restaurant
        });
      }
    }, undefined);
    return ordersWithRestaurant;
  }
}

module.exports = OrdersService;

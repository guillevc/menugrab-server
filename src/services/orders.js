const { OrderState } = require('../shared/enums');
const { timestampToISOStringWithoutMillis } = require('../shared/date');
const { firestore } = require('firebase-admin');

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
      } else {
        return acc;
      }
    }, undefined);

    const ordersRef = this.app.firebase.firestore().collection('orders');
    const newOrderData = {
      userId,
      restaurantId: order.restaurantId,
      orderType: order.orderType,
      orderItems,
      date: firestore.Timestamp.now(),
      orderState: OrderState.pending
    };
    await ordersRef.doc().set(newOrderData);
    return newOrderData;
  }

  async findOne(id) {
    const orderSnapshot = this.app.firebase.firestore().collection('orders').doc(id);
    const orderDoc = await orderSnapshot.get();
    const order = {
      id: orderDoc.id,
      ...orderDoc.data()
    };
    order.date = timestampToISOStringWithoutMillis(order.date);
    return order;
  }

  async findAllByUser(userId) {
    const ordersRef = this.app.firebase.firestore().collection('orders');
    const ordersSnapshot = await ordersRef.where('userId', '==', userId).get();
    let ordersWithRestaurant = []
    await ordersSnapshot.docs.reduce(async (memo, orderDoc) => {
      await memo;
      const order = {
        id: orderDoc.id,
        ...orderDoc.data()
      }
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

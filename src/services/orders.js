const { firestore } = require('firebase-admin');
const { OrderState } = require('../shared/enums');
const {
  timestampToISOStringWithoutMillis,
  isoStringWithoutMillisToTimestamp
} = require('../shared/date');

class OrdersService {
  constructor(app) {
    this.app = app;
  }

  async create(order, userId) {
    // check there isn't already an order in progress
    const ordersRef = this.app.firebase.firestore().collection('orders');
    const inProgressOrderSnapshot = ordersRef
      .where('userId', '==', userId)
      .where('orderState', 'in', OrderState.inProgressStates);
    const existingOrderInProgressExists = (await inProgressOrderSnapshot.get()).docs.length > 0;

    if (existingOrderInProgressExists) {
      throw this.app.httpErrors.conflict('There\'s an order in progress already');
    }

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

    const newOrderData = {
      userId,
      restaurantId: order.restaurantId,
      orderType: order.orderType,
      table: order.table,
      orderItems,
      date: firestore.Timestamp.now(),
      orderState: OrderState.pending
    };
    const newOrderDoc = await ordersRef.add(newOrderData);
    return newOrderDoc.id;
  }

  async findOne(id) {
    const orderSnapshot = this.app.firebase.firestore().collection('orders').doc(id);
    const orderDoc = await orderSnapshot.get();

    if (!orderDoc.exists) {
      throw this.app.httpErrors.notFound(`Order with id ${id} not found`);
    }

    return this._orderWithRestaurantFromDoc(orderDoc);
  }

  async findAllByUser(userId) {
    const ordersRef = this.app.firebase.firestore().collection('orders');
    const ordersSnapshot = await ordersRef.where('userId', '==', userId).orderBy('date', 'desc').get();
    const ordersWithRestaurant = [];
    await ordersSnapshot.docs.reduce(async (memo, orderDoc) => {
      await memo;
      const orderWithRestaurant = await this._orderWithRestaurantFromDoc(orderDoc);
      ordersWithRestaurant.push(orderWithRestaurant);
    }, undefined);
    return ordersWithRestaurant;
  }

  async updateOrderState(orderId, orderState, completionDateAsISOStringWithoutMillis) {
    const orderSnapshot = this.app.firebase.firestore().collection('orders').doc(orderId);
    const newOrderData = {
      orderState,
      completionDate: isoStringWithoutMillisToTimestamp(completionDateAsISOStringWithoutMillis)
    };
    await orderSnapshot.set(newOrderData, { merge: true });
    return { orderState, completionDate: completionDateAsISOStringWithoutMillis };
  }

  async findCurrentOrderByUser(userId) {
    const ordersRef = this.app.firebase.firestore().collection('orders');
    const orderSnapshot = ordersRef
      .where('userId', '==', userId)
      .where('orderState', 'in', OrderState.inProgressStates);
    const orderDoc = (await orderSnapshot.limit(1).get()).docs[0];
    if (orderDoc) {
      return this._orderWithRestaurantFromDoc(orderDoc);
    }
    throw this.app.httpErrors.notFound('There\'s no order in progress');
  }

  async _orderWithRestaurantFromDoc(orderDoc) {
    const order = {
      id: orderDoc.id,
      ...orderDoc.data()
    };
    order.date = timestampToISOStringWithoutMillis(order.date);
    if (order.completionDate) {
      order.completionDate = timestampToISOStringWithoutMillis(order.completionDate);
    }
    order.restaurant = await this.app.restaurantsService.findOne(order.restaurantId);
    return order;
  }
}

module.exports = OrdersService;

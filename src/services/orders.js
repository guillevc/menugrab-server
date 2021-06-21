const { firestore } = require('firebase-admin');
const { OrderState, OrderType } = require('../shared/enums');
const {
  timestampToISOStringWithoutMillis,
  isoStringWithoutMillisToTimestamp
} = require('../shared/date');

class OrdersService {
  constructor(app) {
    this.app = app;
  }

  async create(createOrderDTO, userId) {
    // Expect table number when making a table order
    if (createOrderDTO.orderType === OrderType.table && !createOrderDTO.table) {
      throw this.app.httpErrors.badRequest('Expected `table` in the request when making a table order');
    }

    // Check there isn't already an order in progress
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
    await createOrderDTO.items.reduce(async (acc, reqMenuItem) => {
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
      restaurantId: createOrderDTO.restaurantId,
      orderType: createOrderDTO.orderType,
      table: createOrderDTO.table,
      orderItems,
      date: firestore.Timestamp.now(),
      orderState: OrderState.pending
    };
    const newOrderDoc = await ordersRef.add(newOrderData);
    return newOrderDoc.id;
  }

  async findOne(orderId) {
    const orderSnapshot = this.app.firebase.firestore().collection('orders').doc(orderId);
    const orderDoc = await orderSnapshot.get();

    if (!orderDoc.exists) {
      throw this.app.httpErrors.notFound(`Order with id ${orderId} not found`);
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
      completionDate: completionDateAsISOStringWithoutMillis ? isoStringWithoutMillisToTimestamp(completionDateAsISOStringWithoutMillis) : undefined
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

  async findOrdersByRestaurantGroupedByState(restaurantId) {
    const fetchedOrders = await this._findOrdersByRestaurant(restaurantId);
    const groupedOrders = {};
    Object.values(OrderState).forEach(orderState => {
      groupedOrders[orderState] = [];
    });
    fetchedOrders.forEach(order => {
      groupedOrders[order.orderState].push(order);
    });
    const groupedOrdersAsArray = Object.entries(groupedOrders)
      .reduce((acc, [orderState, orders]) => ([...acc, { orderState, orders }]), []);
    return groupedOrdersAsArray;
  }

  async findOrdersByRestaurant(restaurantId) {
    return this._findOrdersByRestaurant(restaurantId);
  }

  async _findOrdersByRestaurant(restaurantId) {
    const ordersRef = this.app.firebase.firestore().collection('orders');
    // TODO: find last X hours (for completed and cancelled, pending and accepted always show)
    const ordersSnapshot = await ordersRef.where('restaurantId', '==', restaurantId).orderBy('date', 'desc').get();
    return ordersSnapshot.docs.map(orderDoc => {
      const order = {
        id: orderDoc.id,
        ...orderDoc.data()
      };
      order.date = timestampToISOStringWithoutMillis(order.date);
      if (order.completionDate) {
        order.completionDate = timestampToISOStringWithoutMillis(order.completionDate);
      }
      return order;
    });
  }
}

module.exports = OrdersService;

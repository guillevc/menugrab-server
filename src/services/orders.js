class OrdersService {
  constructor(app) {
    this.app = app;
  }

  async create(order, userId) {
    const menuItemsRef = app.firebase.firestore().collectionGroup('menuItems');
    const fetchedMenuItemsWithQuantity = await order.menuItems.reduce(async (acc, reqMenuItem) => {
      const fetchedMenuItem = await menuItemsRef.where('id', '==', reqMenuItem.menuItemId).limit(1).get();
      const fetchedMenuItemDoc = fetchedMenuItem.docs[0];
      if (fetchedMenuItemDoc) {
        return acc.concat([{
          id: fetchedMenuItemDoc.id,
          quantity: reqMenuItem.quantity,
          ...fetchedMenuItemDoc.data()
        }]);
      } else {
        return acc;
      }
    }, []);

    const ordersRef = app.firebase.firestore().collection('orders');
    const newOrderData = {
      userId,
      restaurantId: order.restaurantId,
      orderType: order.orderType,
      menuItems: fetchedMenuItemsWithQuantity,
      date: firebase.firestore.Timestamp.now()
    };
    await ordersRef.doc().set(newOrderData);
    return newOrderData;
  }

  async getOne(orderId) {
    const orderSnapshot = app.firebase.firestore().collection('orders').doc(orderId);
    const orderDoc = await orderSnapshot.get();
    return {
      id: orderDoc.id,
      ...orderDoc.data()
    }
  }

  async getAllByUser(userId) {
    const ordersRef = this.app.firebase.firestore().collection('orders');
    const ordersSnapshot = await ordersRef.where('userId', '==', userId).get();
    return ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // TODO: fetch restaurant data
  }
}

module.exports = { OrdersService };

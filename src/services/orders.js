class OrdersService {
  constructor(app) {
    this.app = app;
  }

  async getAllByUser(userId) {
    const ordersRef = this.app.firebase.firestore().collection('orders');
    const ordersSnapshot = await ordersRef.where('userId', '==', userId).get();
    return ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // TODO: fetch restaurant data
  }

}

module.exports = { OrdersService };

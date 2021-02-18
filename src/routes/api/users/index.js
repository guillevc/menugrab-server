const {
  getUserOrdersSchema
} = require('./schemas');

const routes = async (app, options) => {

  // getUserOrders
  app.get('/:userId/orders', { schema: getUserOrdersSchema/*, preValidation: [app.requireFirebaseAuth] */ }, async (req, reply) => {
    const { userId } = req.params;

    if (userId !== app.user.uid) {
      throw app.httpErrorrs.forbidden();
    }

    const ordersRef = app.firebase.firestore().collection('orders');
    const ordersSnapshot = await ordersRef.where('userId', '==', userId);
    return ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // TODO: fetch restaurant data
  });

};

module.exports = routes;

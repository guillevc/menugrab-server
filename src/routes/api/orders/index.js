const firebase = require('firebase-admin');

const {
  createOrderSchema,
  getOrderSchema
} = require('./schemas');

const routes = async (app, options) => {

  // createOrder
  app.post('/', { schema: createOrderSchema/*, preValidation: [app.requireFirebaseAuth] */}, async (req, reply) => {
    const menuItemsRef = app.firebase.firestore().collectionGroup('menuItems');
    console.log(req.body.menuItems);
    const fetchedMenuItemsWithQuantity = await req.body.menuItems.reduce(async (acc, reqMenuItem) => {
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
      // userId: req.user.uid,
      restaurantId: req.body.restaurantId,
      orderType: req.body.orderType,
      menuItems: fetchedMenuItemsWithQuantity,
      date: firebase.firestore.Timestamp.now()
    };
    const res = await ordersRef.doc().set(newOrderData);
    return res;
  });

  // getOrder
  // app.get('/:orderId', { schema: getOrderSchema }, async (req, reply) => {
  
  // });

};

module.exports = routes;

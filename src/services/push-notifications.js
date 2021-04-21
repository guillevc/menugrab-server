class PushNotificationsService {
  constructor(app) {
    this.app = app;
  }

  async notifyOrderStateUpdate(userId, orderId, orderState, restaurantName) {
    const fcmToken = await this.app.usersService.findFCMTokenByUser(userId);
    const message = {
      notification: {
        title: 'Your order was accepted!',
        body: `${restaurantName} accepted your order and will be dispatched soon`
      },
      data: {
        ORDER_ID: orderId,
        ORDER_STATE: orderState
      },
      token: fcmToken
    };
    const messageId = await this.app.firebase.messaging().send(message);

    return messageId;
  }
}

module.exports = PushNotificationsService;

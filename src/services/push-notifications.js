const { OrderState } = require('../shared/enums');

const messageNotificationForOrderState = (orderState, restaurantName) => {
  switch (orderState) {
    case OrderState.pending:
      return {
        title: 'Your order is on the way',
        body: `${restaurantName} will receive your order soon`
      };
    case OrderState.accepted:
      return {
        title: 'Your order was accepted!',
        body: `${restaurantName} accepted your order and will be dispatched soon`
      };
    case OrderState.completed:
      // Silent notification
      return null;
    case OrderState.canceled:
      return {
        title: 'Order canceled',
        body: `Your order from ${restaurantName} was canceled`
      };
    default:
      return null;
  }
};

class PushNotificationsService {
  constructor(app) {
    this.app = app;
  }

  async notifyOrderStateUpdate(userId, orderId, orderState, completionDate, restaurantName) {
    const fcmToken = await this.app.usersService.findFCMTokenByUser(userId);
    const message = {
      token: fcmToken,
      data: {
        ORDER_ID: orderId,
        ORDER_STATE: orderState,
        COMPLETION_DATE: completionDate
      },
      apns: {
        payload: {
          aps: {
            'content-available': 1,
            priority: 10
          }
        }
      }
    };

    // Add title and body if necessary (otherwise it will be a silent notification)
    const notification = messageNotificationForOrderState(orderState, restaurantName);
    if (notification) {
      message.notification = notification;
    }

    await this.app.firebase.messaging().send(message);
  }
}

module.exports = PushNotificationsService;

class UsersService {
  constructor(app) {
    this.app = app;
  }

  async updateFCMToken(userId, fcmToken) {
    const restaurantSnapshot = this.app.firebase.firestore().collection('users').doc(userId);

    const data = { fcmToken };
    await restaurantSnapshot.set(data);

    // TODO: improve response with errors
    return data;
  }
}

module.exports = UsersService;

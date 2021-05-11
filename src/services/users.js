export default class UsersService {
  constructor(app) {
    this.app = app;
  }

  async findFCMTokenByUser(userId) {
    const userSnapshot = this.app.firebase.firestore().collection('users').doc(userId);
    const userDoc = await userSnapshot.get();
    return userDoc.data().fcmToken;
  }

  async updateFCMToken(userId, fcmToken) {
    const userSnapshot = this.app.firebase.firestore().collection('users').doc(userId);

    const data = { fcmToken };
    await userSnapshot.set(data, { merge: true });

    // TODO: improve response with errors
    return data;
  }
}

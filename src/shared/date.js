import firebaseAdmin from 'firebase-admin';

export const timestampToISOStringWithoutMillis = timestamp => (
  `${timestamp.toDate().toISOString().split('.').shift()}Z`
);

export const isoStringWithoutMillisToTimestamp = isoStringWithoutMillis => {
  const date = new Date(isoStringWithoutMillis);
  return firebaseAdmin.firestore.Timestamp.fromDate(date);
};

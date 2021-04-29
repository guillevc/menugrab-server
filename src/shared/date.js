const { firestore } = require('firebase-admin');

const timestampToISOStringWithoutMillis = timestamp => (
  `${timestamp.toDate().toISOString().split('.').shift()}Z`
);

const isoStringWithoutMillisToTimestamp = isoStringWithoutMillis => {
  const date = new Date(isoStringWithoutMillis);
  return firestore.Timestamp.fromDate(date);
};

module.exports = {
  timestampToISOStringWithoutMillis,
  isoStringWithoutMillisToTimestamp
};

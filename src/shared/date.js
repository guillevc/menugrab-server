const timestampToISOStringWithoutMillis = (timestamp) => {
  return timestamp.toDate().toISOString().split('.').shift() + 'Z';
};

module.exports = { timestampToISOStringWithoutMillis };

const timestampToISOStringWithoutMillis = timestamp => (
  `${timestamp.toDate().toISOString().split('.').shift()}Z`
);

module.exports = { timestampToISOStringWithoutMillis };

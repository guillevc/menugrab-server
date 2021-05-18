const { firestore } = require('firebase-admin');

const coordinatesToGeoPoint = (coordinates) => new firestore.GeoPoint(coordinates.latitude, coordinates.longitude);

module.exports = {
  coordinatesToGeoPoint
};

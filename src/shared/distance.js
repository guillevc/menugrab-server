// https://github.com/manuelbieh/geolib

const EARTH_RADIUS = 6378137;

const robustAcos = value => value > 1 ? 1 : value < -1 ? -1 : value;

const toRad = value => (value * Math.PI) / 180;

const getDistance = (fromLat, fromLong, toLat, toLong) => {
  const distance =
      Math.acos(
          robustAcos(
              Math.sin(toRad(toLat)) * Math.sin(toRad(fromLat)) +
                  Math.cos(toRad(toLat)) *
                      Math.cos(toRad(fromLat)) *
                      Math.cos(toRad(fromLong) - toRad(toLong))
          )
      ) * EARTH_RADIUS;

  return Math.round(distance) / 1000;
};

module.exports = { getDistance };

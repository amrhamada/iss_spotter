const request = require('request-promise-native');

const fetchMyIP = () => request('https://api.ipify.org?format=json');


const fetchCoordsByIp = body => {
  const ip = JSON.parse(body).ip;
  return request(`https://ipvigilante.com/json/${ip}`);
};


const fetchISSFlyOverTimes = body => {
  const {latitude, longitude} = JSON.parse(body).data;
  return request(`http://api.open-notify.org/iss-pass.json?lat=${latitude}&lon=${longitude}`
)};

const nextISSTimesForMyLocation = callback => {

  return fetchMyIP()
  .then(fetchCoordsByIp)
  .then(fetchISSFlyOverTimes)
  .then(body => JSON.parse(body).response)
};

module.exports = { nextISSTimesForMyLocation};

const request = require('request');

const fetchMyIP = callback => {
  request('https://api.ipify.org?format=json', (err, response, body) => {
    if (err) {
      callback(err);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const data = JSON.parse(body);
    callback(null, data.ip);
    
  });
};

const fetchCoordsByIp = (ip, callback) => {
  request('https://ipvigilante.com/json/' + ip, (err, response, body) => {
    if (err) {
      callback(err);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(msg, null);
      return;
    }
    const {latitude, longitude} = JSON.parse(body).data;
    callback(null, {latitude, longitude});
  });
};

const fetchISSFlyOverTimes = (coords, callback) => {
  request(`http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`, (err, response, body) => {
    if (err) {
      callback(err);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching ISS pass times. Response: ${body}`;
      callback(msg, null);
      return;
    }
    callback(null, JSON.parse(body).response);
  });
};

const nextISSTimesForMyLocation = callback => {

  fetchMyIP((error, ip) => {
  if (error) {
    callback("It didn't work!" , error);
    return;
  }

  fetchCoordsByIp(ip, (error, coords) => {
    if (error) {
      callback("It didn't work!" , error);
      return;
    }
    fetchISSFlyOverTimes(coords, (error, timings) => {
      if (error) {
        callback("It didn't work!" , error);
        return;
      }
      callback(null, timings);
    });
  });
});
  
};

module.exports = { nextISSTimesForMyLocation};

Promise = require('es6-promise').Promise;

const doxbee = require('../lib/doxbee-promises.js');
const measure = require('../lib/measure-promises.js');

measure(doxbee, 'b', 'c')
  .then(({ time, mem }) => console.log(JSON.stringify({ time, mem })))
  .catch(error => console.error(error));

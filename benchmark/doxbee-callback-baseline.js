const path = require('path');
const doxbee = require('../lib/doxbee-callback.js');
const measure = require('../lib/measure-callback.js');

try {
  measure(doxbee, ['b', 'c'], (err, res) => {
    console.log(`${path.basename(__filename)}: ${res.time} ms ${res.mem} MiB`);
  });
} catch (err) {
  console.error(err);
}

const path = require('path');
const doxbee = require('../build/doxbee-async-tsc.js');
const measure = require('../build/measure-async-tsc.js');

(async () => {
  try {
    const { time, mem } = await measure(doxbee, 'b', 'c');
    console.log(`${path.basename(__filename)}: ${time} ms ${mem} MiB`);
  } catch (err) {
    console.error(err);
  }
})();

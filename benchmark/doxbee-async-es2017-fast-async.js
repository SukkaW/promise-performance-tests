const doxbee = require('../build/doxbee-async-fast-async.js');
const measure = require('../build/measure-async-fast-async');

(async () => {
  try {
    const { time, mem } = await measure(doxbee, 'b', 'c');
    console.log(JSON.stringify({ time, mem }));
  } catch (err) {
    console.error(err);
  }
})();

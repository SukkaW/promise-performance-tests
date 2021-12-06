const doxbee = require('../build/doxbee-async-to-promises');
const measure = require('../build/measure-async-to-promises');

(async () => {
  try {
    const { time, mem } = await measure(doxbee, 'b', 'c');
    console.log(JSON.stringify({ time, mem }));
  } catch (err) {
    console.error(err);
  }
})();

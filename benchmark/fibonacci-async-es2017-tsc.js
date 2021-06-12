const path = require('path');

const fibonacci = require('../build/fibonacci-async-tsc.js');
const measure = require('../build/measure-async-tsc.js');

(async () => {
  try {
    const { time, mem } = await measure(fibonacci, 42);
    console.log(`${path.basename(__filename)}: ${time} ms ${mem} MiB`);
  } catch (err) {
    console.error(err);
  }
})();

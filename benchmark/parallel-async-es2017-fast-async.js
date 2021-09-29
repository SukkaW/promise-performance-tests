require('regenerator-runtime/runtime');

const fibonacci = require('../build/fibonacci-async-fast-async.js');
const measure = require('../build/measure-async-fast-async.js');

(async () => {
  try {
    const { time, mem } = await measure(fibonacci, 42);
    console.log(JSON.stringify({ time, mem }));
  } catch (err) {
    console.error(err);
  }
})();

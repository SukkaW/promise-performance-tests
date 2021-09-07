const fibonacci = require('../build/fibonacci-async-tsc.js');
const measure = require('../build/measure-async-tsc.js');

(async () => {
  try {
    const { time, mem } = await measure(fibonacci, 42);
    console.log(JSON.stringify({ time, mem }));
  } catch (err) {
    console.error(err);
  }
})();

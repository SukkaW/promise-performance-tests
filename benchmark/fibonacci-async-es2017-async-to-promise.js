const fibonacci = require('../build/fibonacci-async-to-promises.js');
const measure = require('../build/measure-async-to-promises.js');

(async () => {
  try {
    const { time, mem } = await measure(fibonacci, 42);
    console.log(JSON.stringify({ time, mem }));
  } catch (err) {
    console.error(err);
  }
})();

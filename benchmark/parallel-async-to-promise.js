const parallel = require('../build/parallel-async-to-promises.js');
const measure = require('../build/measure-async-to-promises.js');

(async () => {
  try {
    const { time, mem } = await measure(parallel, 'b', 'c');
    console.log(JSON.stringify({ time, mem }));
  } catch (err) {
    console.error(err);
  }
})();

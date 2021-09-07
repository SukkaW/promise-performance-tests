const parallel = require('../build/parallel-async-tsc.js');
const measure = require('../build/measure-async-tsc.js');

(async () => {
  try {
    const { time, mem } = await measure(parallel, 'b', 'c');
    console.log(JSON.stringify({ time, mem }));
  } catch (err) {
    console.error(err);
  }
})();

const parallel = require('../lib/parallel-callback.js');
const measure = require('../lib/measure-callback.js');

try {
  measure(parallel, ['b', 'c'], (err, res) => {
    console.log(JSON.stringify({ time: res.time, mem: res.mem }));
  });
} catch (err) {
  console.error(err);
}

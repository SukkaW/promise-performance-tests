const path = require('path');
const parallel = require('../lib/parallel-callback.js');
const measure = require('../lib/measure-callback.js');

try {
  measure(parallel, ['b', 'c'], (err, res) => {
    console.log(`${path.basename(__filename)}: ${res.time} ms ${res.mem} MiB`);
  });
} catch (err) {
  console.error(err);
}

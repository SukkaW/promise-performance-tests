const path = require('path');
Promise = require('es6-promise').Promise;

const parallel = require('../lib/parallel-promises.js');
const measure = require('../lib/measure-promises.js');

measure(parallel, 'b', 'c')
  .then(({ time, mem }) => {
    console.log(`${path.basename(__filename)}: ${time} ms ${mem} MiB`);
  })
  .catch(reason => console.error(reason));

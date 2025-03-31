Promise = require('core-js-pure/features/promise');

const parallel = require('../lib/parallel-promises.js');
const measure = require('../lib/measure-promises.js');

measure(parallel, 'b', 'c')
  .then(({ time, mem }) => {
    console.log(JSON.stringify({ time, mem }));
  })
  .catch(error => console.error(error));

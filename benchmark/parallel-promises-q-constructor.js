const Q = require('q');
Promise = Q.Promise;

const parallel = require('../lib/parallel-promises.js');
const measure = require('../lib/measure-promises.js');

measure(parallel, 'b', 'c')
  .then(({ time, mem }) => {
    console.log(JSON.stringify({ time, mem }));
  })
  .catch(reason => console.error(reason));

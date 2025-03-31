const Q = require('q');

const parallel = require('../lib/parallel-promises.js');
const measure = require('../lib/measure-promise-no-constructor');

measure(parallel, Q.Promise, Q.all, 'b', 'c')
  .then(({ time, mem }) => {
    console.log(JSON.stringify({ time, mem }));
  })
  .catch(error => console.error(error));

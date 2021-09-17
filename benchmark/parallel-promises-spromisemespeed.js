const SPromise = require('spromisemespeed');

const parallel = require('../lib/parallel-promises.js');
const measure = require('../lib/measure-promise-no-constructor');

measure(parallel, SPromise, SPromise.all, 'b', 'c')
  .then(({ time, mem }) => {
    console.log(JSON.stringify({ time, mem }));
  })
  .catch(reason => console.error(reason));

const SPromise = require('spromisemespeed/dist/SPromiseMeSpeed.min.js');

const parallel = require('../lib/parallel-promises.js');
const measure = require('../lib/measure-promise-no-constructor');

measure(parallel, SPromise, SPromise.all, 'b', 'c')
  .then(({ time, mem }) => {
    console.log(JSON.stringify({ time, mem }));
  })
  .catch(error => console.error(error));

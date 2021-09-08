global.SPromise = require('spromisemespeed');

const parallel = require('../lib/parallel-promises.js');
const measure = require('../lib/measure-spromiseme');

measure(parallel, 'b', 'c')
  .then(({ time, mem }) => {
    console.log(JSON.stringify({ time, mem }));
  })
  .catch(reason => console.error(reason));

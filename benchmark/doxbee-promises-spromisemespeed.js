const SPromise = require('spromisemespeed');

const doxbee = require('../lib/doxbee-promises.js');
const measure = require('../lib/measure-promise-no-constructor.js');

measure(doxbee, SPromise, SPromise.all, 'b', 'c')
  .then(({ time, mem }) => {
    console.log(JSON.stringify({ time, mem }));
  })
  .catch(error => console.error(error));

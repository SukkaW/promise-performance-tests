const { driverNoNewPromise: driver } = require('./driver.js');
const config = require('./config.js');

module.exports = function measure(fn, promise, promiseAll, ...args) {
  // Warm up
  let p = driver(Math.min(350, config.iterations), fn, promise, promiseAll, ...args).then(_ => ({
    ptime: 0,
    pmem: 0
  }));

  for (let k = 0; k < config.runs; ++k) {
    p = p.then(({ ptime, pmem }) => {
      return driver(config.iterations, fn, promise, promiseAll, ...args).then(({ time, mem }) => {
        ptime = ptime + time;
        pmem = pmem + mem;

        return { ptime, pmem };
      });
    });
  }
  return p.then(({ ptime, pmem }) => ({
    time: (ptime / config.runs).toFixed(3),
    mem: (pmem / config.runs / 1024 / 1024).toFixed(3)
  }));
};

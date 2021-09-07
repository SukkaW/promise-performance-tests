const config = require('../lib/config.js');
const { driverCallback: driver } = require('../lib/driver');

module.exports = async function measure(fn, args, callback) {
  // Warmup pass.
  driver(Math.min(350, config.iterations), fn, args, () => {
    // Perform K runs with N promises.

    let times = 0;
    let mems = 0;

    const addTimes = (time) => { times = times + time; };
    const addMems = (mem) => { mems = mems + mem; };

    for (let k = 0; k < config.runs; ++k) {
      driver(config.iterations, fn, args, (_, res) => {
        addTimes(res.time);
        addMems(res.mem);
      });
    }

    process.nextTick(() => {
      callback(null, {
        time: (times / config.runs).toFixed(3),
        mem: (mems / config.runs / 1024 / 1024).toFixed(3)
      });
    });
  });
};

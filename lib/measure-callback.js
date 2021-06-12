const config = require('../lib/config.js');

module.exports = async function measure(fn, args, callback) {
  // Warmup pass.
  driver(Math.min(350, config.iterations), fn, args, () => {
    // Perform K runs with N promises.

    let times = 0;
    let mems = 0;
    for (let k = 0; k < config.runs; ++k) {
      // eslint-disable-next-line no-loop-func
      driver(config.iterations, fn, args, (_, res) => {
        times += res.time;
        mems += res.mem;
      });
    }

    callback(null, {
      time: (times / config.runs).toFixed(3),
      mem: (mems / config.runs / 1024 / 1024).toFixed(3)
    });
  });
};

function driver(times, fn, args, callback) {
  const startTime = Date.now();

  let memMax = process.memoryUsage().rss;
  const memStart = process.memoryUsage().rss;
  for (let k = 0; k < times; ++k) {
    fn(k, ...args);
    memMax = Math.max(memMax, process.memoryUsage().rss);
  }
  callback(null, {
    time: Date.now() - startTime,
    mem: memMax - memStart
  });
}

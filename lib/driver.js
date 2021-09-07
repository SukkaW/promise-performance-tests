const performance = globalThis.performance || require('perf_hooks').performance;
const PerformanceObserver = globalThis.PerformanceObserver || require('perf_hooks').PerformanceObserver;

function driver(times, fn, ...args) {
  return new Promise(resolve => {
    let memMax = 0;
    let memStart = 0;

    const obs = new PerformanceObserver(list => {
      const { duration: time } = list.getEntries()[0];
      obs.disconnect();

      resolve({
        time,
        mem: memMax - memStart
      });
    });
    obs.observe({ entryTypes: ['measure'] });

    const promises = new Array(times);

    performance.mark('begin');

    memMax = process.memoryUsage().rss;
    memStart = process.memoryUsage().rss;

    for (let k = 0; k < times; ++k) {
      promises[k] = fn(k, ...args);
      memMax = Math.max(memMax, process.memoryUsage().rss);
    }
    Promise.all(promises).then(() => {
      performance.mark('end');
      performance.measure('name', 'begin', 'end');
    });
  });
}

function driverCallback(times, fn, args, callback) {
  let memMax = 0;
  let memStart = 0;

  const obs = new PerformanceObserver(list => {
    const { duration: time } = list.getEntries()[0];
    obs.disconnect();

    callback(null, {
      time,
      mem: memMax - memStart
    });
  });
  obs.observe({ entryTypes: ['measure'] });

  performance.mark('begin');

  memMax = process.memoryUsage().rss;
  memStart = process.memoryUsage().rss;

  for (let k = 0; k < times; ++k) {
    fn(k, ...args);
    memMax = Math.max(memMax, process.memoryUsage().rss);
  }
  performance.mark('end');

  performance.mark('end');
  performance.measure('name', 'begin', 'end');
}

exports.driver = driver;
exports.driverCallback = driverCallback;

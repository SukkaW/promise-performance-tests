const performance = (typeof globalThis === 'object' && globalThis.performance) || require('perf_hooks').performance;
const PerformanceObserver = (typeof globalThis === 'object' && globalThis.PerformanceObserver) || require('perf_hooks').PerformanceObserver;

const HAS_PROCESS_OBJECT = typeof process !== 'undefined';
const IS_MEMORY_RSS_FAST_ACCESS_SUPPORTED = typeof process !== 'undefined' && typeof process.memoryUsage.rss === 'function';
function getMemoryRss() {
  if (HAS_PROCESS_OBJECT) {
    return IS_MEMORY_RSS_FAST_ACCESS_SUPPORTED ? process.memoryUsage.rss() : process.memoryUsage().rss;
  }
  return 0;
}

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

    memMax = getMemoryRss();
    memStart = getMemoryRss();

    for (let k = 0; k < times; ++k) {
      promises[k] = fn(k, ...args);
      memMax = Math.max(memMax, getMemoryRss());
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

  memMax = getMemoryRss();
  memStart = getMemoryRss();

  for (let k = 0; k < times; ++k) {
    fn(k, ...args);
    memMax = Math.max(memMax, getMemoryRss());
  }
  performance.mark('end');

  performance.mark('end');
  performance.measure('name', 'begin', 'end');
}

function driverNoNewPromise(times, fn, promise, promiseAll, ...args) {
  return promise(resolve => {
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

    memMax = getMemoryRss();
    memStart = getMemoryRss();

    for (let k = 0; k < times; ++k) {
      promises[k] = fn(k, ...args);
      memMax = Math.max(memMax, getMemoryRss());
    }
    promiseAll(promises).then(() => {
      performance.mark('end');
      performance.measure('name', 'begin', 'end');
    });
  });
}

exports.driver = driver;
exports.driverCallback = driverCallback;
exports.driverNoNewPromise = driverNoNewPromise;

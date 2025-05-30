'use strict';

const cp = require('node:child_process');
const fsp = require('node:fs/promises');
const { table, getBorderCharacters } = require('table');
const process = require('node:process');

const config = require('./lib/config.js');

const arg = process.argv.slice(2).join(' ');

function benchmarkFilter(file) {
  const conditions = [];
  if (arg.includes('--native-vs-bluebird')) {
    conditions.push(file.includes('promises-bluebird') || file.includes('async-es2017-native') || file.includes('promises-es2015-native'));
  }
  if (arg.includes('--promise-polyfill')) {
    conditions.push(file.includes('doxbee-promises') || file.includes('parallel-promises'));
  }
  if (arg.includes('--async')) {
    conditions.push(file.includes('async-'));
  }

  return conditions.every(Boolean);
}

(async () => {
  printPlatformInformation();
  printBenchmarkConfig();

  const BENCHMARKS = (await fsp.readdir('benchmark'))
    .filter(filename => filename.endsWith('.js') && benchmarkFilter(filename))
    .sort();

  const results = [['Name', 'Time (ms)', 'Memory (MiB)']];

  try {
    for (const benchmark of BENCHMARKS) {
      console.log(`Benchmarking ${benchmark}...`);
      const p = cp.spawnSync(process.execPath, [`./benchmark/${benchmark}`]);
      const stdout = p.stdout.toString().trim();
      const stderr = p.stderr.toString().trim();
      try {
        const data = JSON.parse(stdout);
        results.push([benchmark, data.time, data.mem]);
      } catch { }
      if (stderr !== '') console.error(`[${benchmark}]`, stderr);
    }

    console.log('');
    console.log(table(results, {
      columns: [
        { alignment: 'left' },
        { alignment: 'right' },
        { alignment: 'right' }
      ],
      columnDefault: {
        paddingLeft: 0,
        paddingRight: 3
      },
      border: getBorderCharacters('void'),
      drawHorizontalLine: () => false
    }));
  } catch (err) {
    console.error(err);
  }
})();

function printPlatformInformation() {
  console.log('Platform info:');

  const os = require('node:os');
  const { node, v8 } = process.versions;
  const plat = `OS: ${os.type()} ${os.release()} ${os.arch()}\nNode.js: ${node}\nV8: ${v8}`;
  const cpus = os.cpus().reduce((o, cpu) => {
    o[cpu.model] = (o[cpu.model] || 0) + 1;
    return o;
  }, {});
  const cpusInfo = Object.keys(cpus).map((key) => `${key} x ${cpus[key]}`).join('\n');

  console.log(`${plat}\nCPU: ${cpusInfo}\nMemory: ${os.totalmem() / (1024 * 1024)} MiB\n`);
}

function printBenchmarkConfig() {
  console.log('Benchmark config:');
  console.log('Iterations:', config.iterations);
  console.log('Parallel queries:', config.parallelQueries);
  console.log('Runs:', config.runs);
  console.log();
}

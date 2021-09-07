const cp = require('child_process');
const listDir = require('@sukka/listdir');
const table = require('text-table');

const config = require('./lib/config.js');

(async () => {
  printPlatformInformation();
  printBenchmarkConfig();

  const BENCHMARKS = (await listDir('benchmark'))
    .filter(filename => filename.endsWith('.js'))
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
      } catch {}
      if (stderr !== '') console.error(`[${benchmark}]`, stderr);
    }

    console.log('');
    console.log(table(results, { align: ['l', 'r', 'r'] }));
  } catch (err) {
    console.error(err);
  }
})();

function printPlatformInformation() {
  console.log('Platform info:');

  const os = require('os');
  const { node, v8 } = process.versions;
  const plat = `OS: ${os.type()} ${os.release()} ${os.arch()}\nNode.js: ${node}\nV8: ${v8}`;
  const cpus = os.cpus().map(cpu => cpu.model).reduce((o, model) => {
    o[model] = (o[model] || 0) + 1;
    return o;
  }, {});
  const cpusInfo = Object.keys(cpus).map((key) => {
    return `${key} x ${cpus[key]}`;
  }).join('\n');

  console.log(`${plat}\nCPU: ${cpusInfo}\nMemory: ${os.totalmem() / (1024 * 1024)} MiB\n`);
}

function printBenchmarkConfig() {
  console.log('Benchmark config:');
  console.log('Iterations:', config.iterations);
  console.log('Parallel queries:', config.parallelQueries);
  console.log('Runs:', config.runs);
  console.log();
}

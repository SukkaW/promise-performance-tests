const cp = require('child_process');
const listDir = require('@sukka/listdir');

(async () => {
  printPlatformInformation();

  const BENCHMARKS = (await listDir('benchmark'))
    .filter(filename => filename.endsWith('.js'))
    .map(filename => `./benchmark/${filename}`)
    .sort();

  try {
    for (const benchmark of BENCHMARKS) {
      const p = cp.spawnSync(process.execPath, [benchmark]);
      const stdout = p.stdout.toString().trim();
      const stderr = p.stderr.toString().trim();
      if (stdout !== '') console.log(stdout);
      if (stderr !== '') console.error(`[${benchmark}]`, stderr);
    }
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

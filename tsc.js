const ts = require('typescript');
const fsp = require('fs/promises');
const path = require('path');

(async () => {
  const sourcePath = path.resolve(__dirname, process.argv.slice(2)[0]);
  const outputPath = path.resolve(__dirname, process.argv.slice(2)[1]);
  const source = await fsp.readFile(sourcePath, 'utf-8');

  const result = ts.transpileModule(source, {
    compilerOptions: {
      allowJs: true
    }
  });

  await fsp.writeFile(outputPath, result.outputText);
})();

'use strict';

const ts = require('typescript');
const fs = require('fs');
const path = require('path');

(() => {
  const sourcePath = path.resolve(__dirname, process.argv.slice(2)[0]);
  const outputPath = path.resolve(__dirname, process.argv.slice(2)[1]);
  const source = fs.readFileSync(sourcePath, 'utf-8');

  const result = ts.transpileModule(source, {
    compilerOptions: {
      allowJs: true
    }
  });

  fs.writeFileSync(outputPath, result.outputText);
})();

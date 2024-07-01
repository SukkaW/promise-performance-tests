'use strict';

module.exports = require('eslint-config-sukka').sukka(
  {
    ignores: {
      customGlobs: [
        'dist/**/*',
        'build**/*'
      ]
    }
  },
  {
    rules: {
      'no-console': 'off',
      'no-global-assign': 'off',
      'class-methods-use-this': 'off',
      'promise/catch-or-return': 'off'
    }
  }
);

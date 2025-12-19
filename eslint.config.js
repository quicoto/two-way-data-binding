import js from '@eslint/js';
import jestPlugin from 'eslint-plugin-jest';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: [`**/*.js`],
    languageOptions: {
      ecmaVersion: `latest`,
      sourceType: `module`,
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
        Proxy: true
      }
    },
    plugins: {
      jest: jestPlugin
    },
    rules: {
      'comma-dangle': [`error`, `never`],
      'no-underscore-dangle': `off`,
      semi: [`error`, `always`],
      'no-param-reassign': `off`,
      quotes: [`error`, `backtick`]
    }
  }
];

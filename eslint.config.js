import js from '@eslint/js';
import vitestPlugin from '@vitest/eslint-plugin';
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
        ...vitestPlugin.environments.env.globals,
        Proxy: true
      }
    },
    plugins: {
      vitest: vitestPlugin
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

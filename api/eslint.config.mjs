import rootConfig from '../eslint.config.mjs';

export default [
  ...rootConfig,
  {
    files: ['**/*.ts'],
    ignores: ['node_modules/**', 'dist/**', '.turbo/**'],
  },
];

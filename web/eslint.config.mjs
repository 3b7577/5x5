import rootConfig from '../eslint.config.mjs';

export default [
  ...rootConfig,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      globals: {
        document: 'readonly',
        window: 'readonly',
        console: 'readonly',
        process: 'readonly',
      },
    },
    ignores: ['node_modules/**', 'dist/**', '.turbo/**', 'src/vite-env.d.ts'],
  },
];

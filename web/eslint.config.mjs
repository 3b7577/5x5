import rootConfig from '../eslint.config.mjs';

export default [
  ...rootConfig,
  {
    env: {
      browser: true,
      es2020: true,
    },
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      globals: {
        document: 'readonly',
        window: 'readonly',
        console: 'readonly',
        process: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: false,
        },
      ],
    },
    ignores: ['node_modules/**', 'dist/**', '.turbo/**', 'src/vite-env.d.ts'],
  },
];

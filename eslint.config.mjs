import eslintPluginAstro from 'eslint-plugin-astro';
import tsParser from '@typescript-eslint/parser';

export default [
  ...eslintPluginAstro.configs.recommended,
  ...eslintPluginAstro.configs['jsx-a11y-recommended'],
  {
    files: ['**/*.astro'],
    languageOptions: {
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: ['.astro'],
      },
    },
    rules: {
      'astro/jsx-a11y/no-noninteractive-tabindex': [
        'error',
        {
          roles: ['tabpanel', 'region'],
        },
      ],
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
    },
  },
  {
    ignores: [
      'dist/**',
      'coverage/**',
      '.astro/**',
      'node_modules/**',
      'package-lock.json',
    ],
  },
];

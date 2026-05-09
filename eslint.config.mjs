import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import json from '@eslint/json'
import css from '@eslint/css'
import tailwind from 'eslint-plugin-tailwindcss'
import { tailwind3 } from 'tailwind-csstree'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: { js, tseslint },
    extends: ['js/recommended', 'tseslint/recommended'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      'no-restricted-globals': ['off', 'window', 'document', 'close'],
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
  { files: ['**/*.json'], plugins: { json }, language: 'json/json', extends: ['json/recommended'] },
  {
    files: ['tsconfig.json'],
    plugins: { json },
    language: 'json/jsonc',
    extends: ['json/recommended'],
  },
  {
    files: ['**/*.css'],
    plugins: { css, tailwind },
    language: 'css/css',
    languageOptions: { customSyntax: tailwind3, tolerant: true },
    extends: ['css/recommended'],
    rules: {
      'css/no-invalid-at-rules': 'off',
      'css/use-baseline': ['warn', { allowSelectors: ['nesting'] }],
    },
  },
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    '.vscode/**',
    'public/sw.js',
    'public/workbox-*.js',
  ]),
])

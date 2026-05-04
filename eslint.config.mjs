import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
// import pluginReact from 'eslint-plugin-react'
import json from '@eslint/json'
import css from '@eslint/css'
import tailwind from 'eslint-plugin-tailwindcss'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: { js, tseslint },
    extends: ['js/recommended', 'tseslint/recommended'],
    languageOptions: { globals: globals.browser },
    rules: {
      'no-restricted-properties': [
        'error',
        {
          object: 'window',
          property: 'document',
        },
      ],
      'no-restricted-globals': ['error', 'document'],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
  // tseslint.configs.recommended,
  // pluginReact.configs.flat.recommended,
  { files: ['**/*.json'], plugins: { json }, language: 'json/json', extends: ['json/recommended'] },
  // { files: ['**/*.css'], plugins: { css, tailwind }, language: 'css/css', extends: ['css/recommended'] },
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

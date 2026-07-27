import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
  { ignores: ['**/dist/**', '**/node_modules/**', '**/*.d.ts', '**/*.js', '**/*.cjs', '**/*.mjs', '**/create-deer-mobile/template/**', '**/server/index.ts', '**/vitest.config.*', 'vitest.workspace.ts', '**/playwright.config.*', '**/test/visual/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        process: 'readonly',
        console: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          varsIgnorePattern: '^h$',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
  // 测试文件允许 any（mock 场景需要）
  {
    files: ['**/__tests__/**', '**/*.test.ts', '**/*.spec.ts', '**/*.test.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  // deer-mobile JSX 布局/渲染函数中 any 不可避免（Vue JSX slot 类型不完善）
  {
    files: ['packages/deer-mobile/src/layouts/*.tsx', 'packages/deer-mobile/plugins/**/*.ts', 'packages/deer-mobile/src/runtime/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  eslintConfigPrettier,
);

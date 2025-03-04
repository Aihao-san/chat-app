import { configs } from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import { node, jest } from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...node, // Глобальные переменные для Node.js
        ...jest, // Глобальные переменные для Jest (если используется)
      },
      ecmaVersion: 'latest', // Используем последнюю версию ECMAScript
      sourceType: 'module', // Используем модули (ESM)
      parserOptions: {
        project: './tsconfig.eslint.json', // Указываем новый tsconfig
        tsconfigRootDir: import.meta.dirname, // Указываем корневую директорию для tsconfig.json
      },
    },
  },
  {
    rules: {
      // Отключаем правило, запрещающее require()
      '@typescript-eslint/no-require-imports': 'off',

      // Другие правила
      '@typescript-eslint/no-explicit-any': 'off', // Отключаем проверку на any
      '@typescript-eslint/no-floating-promises': 'warn', // Предупреждение для забытых промисов
      '@typescript-eslint/no-unsafe-argument': 'warn', // Предупреждение для небезопасных аргументов
      'prettier/prettier': 'error', // Включаем Prettier для форматирования
    },
  },
);

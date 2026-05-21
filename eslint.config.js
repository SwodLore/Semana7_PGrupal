// ============================================================
// PERSONA 4 — QA & Hook Validator
// Configuración ESLint con plugin react-hooks
// ============================================================
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // Obliga a declarar todas las dependencias en useEffect/useMemo/useCallback
      'react-hooks/exhaustive-deps': 'warn',
      // Obliga a respetar las reglas de Hooks (no llamar en loops, condiciones, etc.)
      'react-hooks/rules-of-hooks': 'error',
    },
  },
]

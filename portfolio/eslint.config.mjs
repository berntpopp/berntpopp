import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import globals from 'globals'

export default [
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.{js,mjs,cjs,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'vue/multi-word-component-names': 'off',
    },
  },
  {
    ignores: ['node_modules/**', '.vitepress/dist/**', '.vitepress/cache/**'],
  },
  skipFormatting,
]

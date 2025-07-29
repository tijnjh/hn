import antfu from '@antfu/eslint-config'

export default antfu({
  react: true,
  rules: {
    'antfu/top-level-function': 'off',
    'unicorn/throw-new-error': 'off',
  },
})

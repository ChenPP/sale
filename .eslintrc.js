module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
  ],
  rules: {
    'no-param-reassign': 0,
    'import/prefer-default-export': 0,
    'import/no-dynamic-require': 0,
    'global-require': 0,
  },
  'parserOptions':
  {
    'parser': 'babel-eslint'
  }
}
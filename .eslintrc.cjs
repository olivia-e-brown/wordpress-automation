module.exports = {
  env: {
    node: true,
    browser: true,
    es2021: true,
  },
  extends: 'standard',
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'linebreak-style': 'windows',
    'prettier/prettier': 'error',
    'comma-dangle': 'off',
    semi: 'off',
  },
  plugins: ['prettier'],
};

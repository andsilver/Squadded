module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended'
  ],
  // add your custom rules here
  rules: {
    "no-tabs": "off",
    "space-before-function-paren": "off",
    "vue/html-indent": ["error", "tab"],
    "indent": [
      "error",
      "tab",
      {
        "flatTernaryExpressions": true
      }
    ],
  },
}

module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    "no-underscore-dangle": 'off',
    "jsx-a11y/label-has-associated-control": "off",
    "jsx-a11y/label-has-for": 0,
    "camelcase": ["error", {"allow": ["object_ids"]}],
    "linebreak-style":0
  },
  parser: "babel-eslint"
};

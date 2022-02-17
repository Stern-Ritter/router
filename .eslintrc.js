module.exports = {
  env: {
    browser: true,
    es2021: true,
    "jest/globals": true,
  },
  extends: [
    "airbnb-base",
    "prettier",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 13,
    sourceType: "module",
  },
  ignorePatterns: [
    ".eslintrc.js",
    "webpack.config.js",
    "babel.config.js",
    "dist/**/*",
    "coverage/**/*",
  ],
  rules: {
    "import/no-unresolved": "off",
    "import/extensions": ["warn", "never"],
    "import/prefer-default-export": "off",
    "default-param-last": "off",
    "lines-between-class-members": [
      "error",
      "always",
      { exceptAfterSingleLine: true },
    ],
    "no-param-reassign": ["error", { props: false }],
    "max-len": [
      "error",
      {
        code: 100,
        ignoreComments: true,
      },
    ],
  },
  plugins: ["jest", "@typescript-eslint"],
};

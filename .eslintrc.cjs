module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true
  },
  extends: ["eslint:recommended"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  ignorePatterns: ["node_modules", "client/dist"],
  overrides: [
    {
      files: ["server/**/*.js"],
      env: { node: true, browser: false }
    },
    {
      files: ["client/**/*.{js,jsx}"],
      env: { browser: true, node: false },
      rules: {
        "no-unused-vars": "off"
      }
    },
    {
      files: [
        "client/**/*.test.{js,jsx}",
        "client/**/*.e2e.{js,jsx}",
        "server/**/*.test.js"
      ],
      globals: {
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        vi: "readonly",
        global: "readonly"
      }
    }
  ]
};

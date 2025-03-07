// eslint.config.js
module.exports = {
  languageOptions: {
    ecmaVersion: 2022, // Ajustado para Node.js 18
    sourceType: 'module', // Para módulos ES
    globals: {
      process: 'readonly'
    }
  },
  rules: {
    "array-callback-return": "warn",
    "default-case": "warn",
    "dot-location": ["warn", "property"],
    "eqeqeq": ["warn", "always"],
    "no-empty-function": "warn",
    "no-extra-bind": "warn",
    "no-floating-decimal": "warn",
    "no-implicit-coercion": "warn",
    "no-implicit-globals": "warn",
    "no-implied-eval": "warn",
    "no-invalid-this": "warn",
    "no-iterator": "warn",
    "no-labels": ["warn", { "allowLoop": false, "allowSwitch": false }],
    "no-lone-blocks": "warn",
    "no-multi-str": "warn",
    "no-new": "warn",
    "no-new-func": "warn",
    "no-new-wrappers": "warn",
    "no-octal-escape": "warn",
    "no-return-assign": ["warn", "always"],
    "no-self-compare": "warn",
    "no-sequences": "warn",
    "no-throw-literal": "warn",
    "no-unused-expressions": "warn",
    "no-unused-vars": "warn",
    "no-useless-concat": "warn",
    "no-warning-comments": ["warn", { "terms": ["todo", "fixme"], "location": "start" }],
    "radix": "warn",
    "yoda": ["warn", "never"],
    "no-console": "off",
  }
};

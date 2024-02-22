/** @type {import("prettier").Config} */
module.exports = {
  arrowParens: "avoid",
  bracketSameLine: false,
  bracketSpacing: true,
  jsxSingleQuote: false,
  printWidth: 100,
  semi: false,
  singleAttributePerLine: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: "es5",
  plugins: ['prettier-plugin-tailwindcss']
}

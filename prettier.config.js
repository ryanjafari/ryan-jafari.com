/** @type {import('prettier').Options} */
module.exports = {
  // NOTE: `prettier-plugin-tailwindcss` must come last.
  plugins: ['prettier-plugin-tailwindcss'],
  printWidth: 80,
  semi: false,
  singleAttributePerLine: true,
  singleQuote: true,
  tailwindFunctions: ['clsx'],
}

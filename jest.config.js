module.exports = {
  "roots": [
    "<rootDir>/src"
  ],
  "transform": {
    "\\.(ts|tsx)$": "<rootDir>/node_modules/ts-jest/preprocessor.js"
  },
  "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.(tsx?|js)$",
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ],
}
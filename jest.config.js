const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

/** @type {import('jest').Config} */
module.exports = {
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest',
  },
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
  ],
  modulePathIgnorePatterns: [
    '<rootDir>/dist/',
  ],
  transformIgnorePatterns: [
    '<rootDir>/node_modules/',
    '\\.pnp\\.[^\\/]+$',
    '<rootDir>/dist/',
  ],
  watchPathIgnorePatterns: [
    '<rootDir>/dist/',
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/packages/.+/src/tests/mocks.ts',
  ],
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
};

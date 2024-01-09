const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions: { baseUrl } } = require('./tsconfig.json');
const { compilerOptions: { paths } } = require('./tsconfig.path.json');

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  transform: {
    '^.+\\.(tsx?|jsx)$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.path.json',
      },
    ],
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
  modulePaths: [baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(paths),
};

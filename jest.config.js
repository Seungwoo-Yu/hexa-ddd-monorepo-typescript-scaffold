/** @type {import('jest').Config} */
module.exports = {
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest',
  },
  coveragePathIgnorePatterns: [
    '<rootDir>/packages/.+/src/tests/mocks.ts',
  ],
};

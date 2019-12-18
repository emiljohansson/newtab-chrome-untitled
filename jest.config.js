module.exports = {
  testEnvironment: 'node',
  setupFiles: [
    './test/helpers/setup-test-env.js'
  ],
  // globalSetup: './test/helpers/setup.js',
  // globalTeardown: './test/helpers/teardown.js',
  collectCoverageFrom: [
    '!**/*.{js}',
    '**/core/**/*.{ts}',
    '**/store/**/*.{ts}',
    '!**/AppTemplate.ts',
    '!**/*.d.ts',
    '!src/*.ts',
    '!__test__/**/*',
    '!test/**/*',
    '!**/node_modules/**'
  ],
  watchPathIgnorePatterns: [
    'src/apps'
  ],
  moduleFileExtensions: [
    'ts',
    'js'
  ],
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  },
  testMatch: [
    '**/test/core/*.ts',
    '**/test/store/*.ts'
  ],
  globals: {
    'ts-jest': {
      babelConfig: true,
      tsConfig: 'jest.tsconfig.json'
    }
  },
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/src/apps/'
  ],
  coverageReporters: [
    'json',
    'lcov',
    'text',
    'text-summary'
  ],
  moduleNameMapper: {},
  transformIgnorePatterns: []
}

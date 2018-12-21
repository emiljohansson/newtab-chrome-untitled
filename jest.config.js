module.exports = {
  verbose: true,
  testEnvironment: 'node',
  setupFiles: [
    './test/helpers/setup-test-env.js'
  ],
  // globalSetup: './test/helpers/setup.js',
  // globalTeardown: './test/helpers/teardown.js',
  collectCoverageFrom: [
    '!**/*.{js}',
    '**/*.{ts}',
    '!**/*.d.ts',
    '!src/*.ts',
    '!__test__/**/*',
    '!test/**/*',
    '!**/node_modules/**'
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
    '!**/test/core/oFor.ts',
    '!**/test/core/oIf.ts',
    '!**/test/core/oOn.ts',
    '!**/test/core/replaceWithTemplate.ts',
    '!**/test/core/state.ts',
    '!**/test/core/storeAttributes.ts',
    '!**/test/core/watch.ts'
  ],
  globals: {
    'ts-jest': {
      useBabelrc: true,
      tsConfigFile: 'jest.tsconfig.json'
    }
  },
  coveragePathIgnorePatterns: [
    '/node_modules/'
  ],
  coverageReporters: [
    'json',
    'lcov',
    'text',
    'text-summary'
  ],
  moduleNameMapper: {},
  transformIgnorePatterns: [
    '/node_modules/(?!lodash-es).+\\.js$'
  ]
}

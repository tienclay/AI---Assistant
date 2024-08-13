export default {
  verbose: true,
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '',
  testEnvironment: 'node',
  testTimeout: 30000,
  // setupFilesAfterEnv: ['./test/setup-app.ts'],
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  coveragePathIgnorePatterns: [
    '.module.ts',
    '<rootDir>/src/config/*',
    '<rootDir>/src/main.ts',
    '.mock.ts',
  ],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^@entities(.*)$': '<rootDir>database/entities/$1',
    '^@enums(.*)$': '<rootDir>/src/common/enums/$1',
  },
};

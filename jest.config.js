module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testMatch: ["<rootDir>/src/**/?(*.)test.ts"],
  // testRegex: '(/src/.*|(\\.|/)(test|spec))\\.(ts)$',
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
};

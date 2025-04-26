import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testMatch: ['<rootDir>/src/**/?(*.)test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
};

export default config;

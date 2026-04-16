export default {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  globalSetup: "<rootDir>/tests/jest.global-setup.ts",
  setupFilesAfterEnv: ["<rootDir>/tests/jest.ratelimiter-setup.mjs"],
  globalTeardown: "<rootDir>/tests/jest.global-teardown.ts",
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  maxWorkers: 1,
};


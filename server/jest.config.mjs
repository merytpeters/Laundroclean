export default {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  globalSetup: "<rootDir>/tests/jest.global-setup.mjs",
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
};


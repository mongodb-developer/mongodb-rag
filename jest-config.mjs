// jest-config.mjs
export default {
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".js", ".mjs"],
  moduleFileExtensions: ["js", "mjs"],
  transform: {},
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1"
  },
  setupFiles: ["<rootDir>/tests/setup.js"],
  setupFilesAfterEnv: ["<rootDir>/tests/setupAfterEnv.js"],
  testMatch: [
    "**/tests/**/*.test.js",
    "**/tests/**/*.test.mjs",
    "**/src/**/*.test.js",
    "**/src/**/*.test.mjs"
  ],
  testTimeout: 30000,
  slowTestThreshold: 10000,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],
  verbose: true,
  detectOpenHandles: true,
  testEnvironmentOptions: {
    url: "http://localhost"
  },
  injectGlobals: true
};
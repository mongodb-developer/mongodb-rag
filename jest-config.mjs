export default {
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".js"],
  transform: {},
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  setupFiles: ["<rootDir>/tests/setup.js"],
  testMatch: ["**/tests/**/*.test.js", "**/src/**/*.test.js"],
  testTimeout: 30000,
  slowTestThreshold: 10000,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],
  verbose: true,
  detectOpenHandles: true,
  testEnvironmentOptions: {
    url: "http://localhost",
  },
};

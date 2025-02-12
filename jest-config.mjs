export default {
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".js"],
  transform: {},
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  setupFiles: ["<rootDir>/tests/setup.js"],
  testMatch: [
    "**/src/**/*.test.mjs",   // ✅ Existing unit tests
    "**/tests/**/*.test.mjs"  // ✅ Ensure CLI tests are included
  ],
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

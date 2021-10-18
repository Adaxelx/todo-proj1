/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  globalSetup: "<rootDir>/testConfig/setup.js",
  globalTeardown: "<rootDir>/testConfig/teardown.js",
  setupFilesAfterEnv: ["<rootDir>/testConfig/setupAfterEnv.js"],
  testEnvironment: "<rootDir>/testConfig/environment.js",
};

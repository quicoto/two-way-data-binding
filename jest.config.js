// Sync object
/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  verbose: true,
  testEnvironment: `jsdom`,
  transform: {
    "^.+\\.jsx?$": `babel-jest`
  },
  setupFilesAfterEnv: [`<rootDir>/jest-setup.js`]
};

export default config;

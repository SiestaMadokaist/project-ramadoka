const dotenv = require('dotenv');
dotenv.config({ path: './env/dev.sh' });

module.exports = {
  "moduleFileExtensions": [ "ts", "tsx", "js" ],
  "transform": {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  "testMatch": [
    "**/**/*.spec.(ts|tsx)"
  ],
  "testEnvironment": "node",
  "collectCoverage": true,
  "coverageReporters": ["json", "html"],
}